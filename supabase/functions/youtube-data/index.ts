// supabase/functions/youtube-data/index.ts
//
// Server-side proxy for every DevOptimizeBot tool that needs real YouTube
// data. Keeping this as ONE function with an `action` switch (rather than
// one function per tool) means the API key only has to be configured once,
// and adding a new YouTube-backed tool is a new `case`, not a new deploy.
//
// Required secret: YOUTUBE_API_KEY (a YouTube Data API v3 key from Google
// Cloud Console). Set with: supabase secrets set YOUTUBE_API_KEY=xxxx
//
// Deploy with default JWT verification ON (no --no-verify-jwt flag) —
// unlike telegram-auth, this function should only ever be called by an
// already-authenticated client, so Supabase's gateway can reject
// unauthenticated requests before this code even runs. The custom session
// tokens issued by telegram-auth are signed with the project's JWT secret,
// so they satisfy this check the same way a normal Supabase session would.
//
// Quota note: most calls here cost 1 unit against your daily YouTube API
// quota (10,000 units/day by default); search.list (used by the "searchTrend"
// action) costs 100 units per call, so it's the one worth rate-limiting or
// caching if usage grows.

import { corsHeaders, json } from '../_shared/http.ts'

const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY') ?? ''
const BASE = 'https://www.googleapis.com/youtube/v3'

async function callYouTube(path: string, params: Record<string, string>) {
  const url = new URL(`${BASE}/${path}`)
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value)
  url.searchParams.set('key', YOUTUBE_API_KEY)

  const res = await fetch(url.toString())
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error?.message ?? `YouTube API returned ${res.status}`)
  }
  return data
}

interface ActionHandlers {
  [action: string]: (params: Record<string, unknown>) => Promise<unknown>
}

const handlers: ActionHandlers = {
  async metadata({ videoId }) {
    const data = await callYouTube('videos', { part: 'snippet,statistics,contentDetails', id: String(videoId) })
    const item = data.items?.[0]
    if (!item) throw new Error('Video not found — check the ID and that it is public.')
    return {
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      tags: item.snippet.tags ?? [],
      viewCount: item.statistics?.viewCount ?? null,
      likeCount: item.statistics?.likeCount ?? null,
      commentCount: item.statistics?.commentCount ?? null,
      duration: item.contentDetails?.duration ?? null,
    }
  },

  async tags({ videoId }) {
    const data = await callYouTube('videos', { part: 'snippet', id: String(videoId) })
    const item = data.items?.[0]
    if (!item) throw new Error('Video not found — check the ID and that it is public.')
    return { tags: item.snippet.tags ?? [], title: item.snippet.title }
  },

  async regionRestriction({ videoId }) {
    const data = await callYouTube('videos', { part: 'contentDetails,snippet', id: String(videoId) })
    const item = data.items?.[0]
    if (!item) throw new Error('Video not found — check the ID and that it is public.')
    const restriction = item.contentDetails?.regionRestriction
    return {
      title: item.snippet.title,
      mode: restriction ? (restriction.blocked ? 'blocked' : 'allowed') : 'none',
      countries: restriction?.blocked ?? restriction?.allowed ?? [],
    }
  },

  async comments({ videoId, maxResults }) {
    try {
      const data = await callYouTube('commentThreads', {
        part: 'snippet',
        videoId: String(videoId),
        maxResults: String(maxResults ?? 100),
        order: 'relevance',
        textFormat: 'plainText',
      })
      const comments = (data.items ?? []).map((item: { snippet: { topLevelComment: { snippet: { authorDisplayName: string; textDisplay: string; likeCount: number } } } }) => ({
        author: item.snippet.topLevelComment.snippet.authorDisplayName,
        text: item.snippet.topLevelComment.snippet.textDisplay,
        likeCount: item.snippet.topLevelComment.snippet.likeCount,
      }))
      return { comments }
    } catch (err) {
      throw new Error(err instanceof Error && err.message.includes('disabled') ? 'Comments are disabled on this video.' : (err as Error).message)
    }
  },

  async subscriberCount({ channelRef, refType }) {
    const params = refType === 'id' ? { id: String(channelRef) } : { forHandle: String(channelRef) }
    const data = await callYouTube('channels', { part: 'snippet,statistics', ...params })
    const item = data.items?.[0]
    if (!item) throw new Error('Channel not found — check the handle or ID.')
    const stats = item.statistics
    return {
      channelId: item.id,
      title: item.snippet.title,
      hidden: stats.hiddenSubscriberCount === true,
      subscriberCount: stats.hiddenSubscriberCount ? null : stats.subscriberCount,
      videoCount: stats.videoCount,
      viewCount: stats.viewCount,
    }
  },

  async channelId({ channelRef, refType }) {
    if (refType === 'id') return { channelId: channelRef }
    const data = await callYouTube('channels', { part: 'snippet', forHandle: String(channelRef) })
    const item = data.items?.[0]
    if (!item) throw new Error("Couldn't resolve that handle to a channel.")
    return { channelId: item.id, title: item.snippet.title }
  },

  async searchTrend({ query }) {
    const data = await callYouTube('search', {
      part: 'snippet',
      q: String(query),
      type: 'video',
      order: 'relevance',
      maxResults: '10',
    })
    return {
      totalResults: data.pageInfo?.totalResults ?? 0,
      results: (data.items ?? []).map((item: { id: { videoId: string }; snippet: { title: string; channelTitle: string; publishedAt: string } }) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
      })),
    }
  },
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405)

  if (!YOUTUBE_API_KEY) {
    return json({ error: 'Server misconfiguration: YOUTUBE_API_KEY is not set.' }, 500)
  }

  let body: { action?: string; params?: Record<string, unknown> }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Expected JSON body: { "action": "...", "params": {...} }' }, 400)
  }

  const handler = body.action ? handlers[body.action] : undefined
  if (!handler) {
    return json({ error: `Unknown action "${body.action}". Valid: ${Object.keys(handlers).join(', ')}` }, 400)
  }

  try {
    const result = await handler(body.params ?? {})
    return json({ data: result })
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Unexpected error' }, 502)
  }
})
