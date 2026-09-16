import { getCachedSession, loginWithTelegram } from './session'
import { isSupabaseConfigured } from './supabaseClient'

export class YoutubeDataError extends Error {}

/**
 * Calls the youtube-data Edge Function. Never touches the YouTube API key —
 * that only exists as a server-side secret (see
 * supabase/functions/youtube-data). Requires a signed-in session (see
 * src/lib/session.ts) since the function is deployed with JWT verification
 * on, to keep the API key's quota from being drained by anonymous callers.
 */
export async function callYoutubeData<T = unknown>(action: string, params: Record<string, unknown> = {}): Promise<T> {
  if (!isSupabaseConfigured) {
    throw new YoutubeDataError('Backend not connected yet — this needs Supabase configured with YOUTUBE_API_KEY set.')
  }

  const session = getCachedSession() ?? (await loginWithTelegram())
  if (!session) {
    throw new YoutubeDataError('Open this inside Telegram to use tools that call the YouTube API.')
  }

  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/youtube-data`
  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, params }),
    })
  } catch {
    throw new YoutubeDataError('Could not reach the YouTube data function.')
  }

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new YoutubeDataError(body.error ?? `Request failed (${res.status}).`)
  }
  return body.data as T
}
