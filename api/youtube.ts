const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

function send(res: any, status: number, body: unknown) {
  res.status(status).setHeader('Content-Type', 'application/json').json(body)
}

function videoId(input: string): string {
  const value = input.trim()
  const match = value.match(/(?:v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/)
  return match?.[1] || (value.length === 11 ? value : '')
}

function channelId(input: string): string {
  const value = input.trim()
  if (/^UC[A-Za-z0-9_-]{20,}$/.test(value)) return value
  return value.match(/youtube\.com\/channel\/(UC[A-Za-z0-9_-]+)/i)?.[1] || ''
}

async function yt(resource: string, params: Record<string, string | number | undefined>) {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) throw new Error('YouTube API key is not configured on Vercel.')
  const q = new URLSearchParams({ key })
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') q.set(k, String(v)) })
  const r = await fetch(`${YOUTUBE_API_BASE}/${resource}?${q}`)
  const data = await r.json()
  if (!r.ok) throw new Error(data?.error?.message || `YouTube API error (${r.status})`)
  return data
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'POST required' })
  try {
    const { action, input = '' } = req.body || {}
    const value = String(input).trim()
    let result = ''

    if (action === 'tag-extractor') {
      const id = videoId(value); if (!id) throw new Error('Enter a valid YouTube video URL or ID.')
      const d = await yt('videos', { part: 'snippet', id }); if (!d.items?.length) throw new Error('Video not found.')
      result = (d.items[0].snippet?.tags || []).join(', ') || 'No public tags were returned.'
    } else if (action === 'channel-id-finder') {
      const direct = channelId(value)
      if (direct) {
        const d = await yt('channels', { part: 'snippet,statistics', id: direct }); if (!d.items?.length) throw new Error('Channel not found.')
        const c=d.items[0]; result=`Channel ID: ${direct}\nTitle: ${c.snippet?.title || 'Unknown'}\nSubscribers: ${c.statistics?.subscriberCount ?? 'hidden'}`
      } else {
        const handle = value.match(/(?:youtube\.com\/\@|^@)([A-Za-z0-9._-]+)/i)?.[1]
        const d = handle ? await yt('channels', { part:'snippet,statistics', forHandle:`@${handle}` }) : await yt('search',{part:'snippet',q:value,type:'channel',maxResults:5})
        if (!d.items?.length) throw new Error('No channel found. Try a channel URL, @handle, or exact channel name.')
        result = d.items.map((x:any,i:number)=>`${i+1}. ${x.snippet?.title}\nChannel ID: ${x.id || x.snippet?.channelId}`).join('\n\n')
      }
    } else if (action === 'region-restriction-checker') {
      const id=videoId(value); if(!id) throw new Error('Enter a valid YouTube video URL or ID.')
      const d=await yt('videos',{part:'snippet,contentDetails',id}); if(!d.items?.length) throw new Error('Video not found.')
      const r=d.items[0].contentDetails?.regionRestriction
      result=`Video: ${d.items[0].snippet?.title}\nBlocked in: ${(r?.block||[]).join(', ') || 'None listed'}\nAllowed only in: ${(r?.allowed||[]).join(', ') || 'Not specified'}`
    } else if (action === 'comment-picker') {
      const id=videoId(value); if(!id) throw new Error('Enter a valid YouTube video URL or ID.')
      const d=await yt('commentThreads',{part:'snippet',videoId:id,maxResults:100,order:'time'})
      const cs=(d.items||[]).map((x:any)=>x.snippet?.topLevelComment?.snippet).filter(Boolean); if(!cs.length) throw new Error('No public comments were returned.')
      const c=cs[Math.floor(Math.random()*cs.length)]; result=`Random comment:\n\n${c.textDisplay}\n\nAuthor: ${c.authorDisplayName}\nLikes: ${c.likeCount}`
    } else if (action === 'live-subscriber-counter') {
      const direct=channelId(value); const handle=value.match(/(?:youtube\.com\/\@|^@)([A-Za-z0-9._-]+)/i)?.[1]
      let d=direct?await yt('channels',{part:'snippet,statistics',id:direct}):handle?await yt('channels',{part:'snippet,statistics',forHandle:`@${handle}`}):await yt('search',{part:'snippet',q:value,type:'channel',maxResults:1})
      if(!d.items?.length) throw new Error('Channel not found.')
      const id=direct||d.items[0].id||d.items[0].snippet?.channelId; if(!id) throw new Error('Channel ID not found.')
      const c=direct||handle?d.items[0]:(await yt('channels',{part:'snippet,statistics',id})).items?.[0]
      result=`Channel: ${c?.snippet?.title || 'Unknown'}\nChannel ID: ${id}\nSubscribers: ${c?.statistics?.subscriberCount ?? 'hidden by channel owner'}\nViews: ${c?.statistics?.viewCount ?? 'N/A'}\nVideos: ${c?.statistics?.videoCount ?? 'N/A'}`
    } else if (action === 'search-trend-analyzer') {
      if(!value) throw new Error('Enter a keyword or topic.')
      const d=await yt('search',{part:'snippet',q:value,type:'video',order:'viewCount',maxResults:10}); if(!d.items?.length) throw new Error('No YouTube results found.')
      result=`YouTube results for: ${value}\n\n`+d.items.map((x:any,i:number)=>`${i+1}. ${x.snippet?.title}\nChannel: ${x.snippet?.channelTitle}\nVideo ID: ${x.id?.videoId}`).join('\n\n')
    } else if (action === 'metadata-viewer') {
      const id=videoId(value); if(!id) throw new Error('Enter a valid YouTube video URL or ID.')
      const d=await yt('videos',{part:'snippet,contentDetails,statistics,status,topicDetails',id}); if(!d.items?.length) throw new Error('Video not found.')
      const x=d.items[0]; result=JSON.stringify({id:x.id,title:x.snippet?.title,description:x.snippet?.description,channelTitle:x.snippet?.channelTitle,channelId:x.snippet?.channelId,publishedAt:x.snippet?.publishedAt,tags:x.snippet?.tags||[],categoryId:x.snippet?.categoryId,duration:x.contentDetails?.duration,definition:x.contentDetails?.definition,views:x.statistics?.viewCount,likes:x.statistics?.likeCount,comments:x.statistics?.commentCount,privacyStatus:x.status?.privacyStatus,embeddable:x.status?.embeddable,topics:x.topicDetails?.topicCategories||[]},null,2)
    } else throw new Error(`Unsupported YouTube action: ${action}`)

    return send(res,200,{ok:true,result})
  } catch(e:any) { return send(res,400,{ok:false,error:e?.message||'Unknown YouTube API error'}) }
}
