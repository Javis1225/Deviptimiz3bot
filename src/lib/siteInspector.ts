import { getCachedSession, loginWithTelegram } from './session'
import { isSupabaseConfigured } from './supabaseClient'

export class SiteInspectorError extends Error {}

export async function inspectSite<T = unknown>(action: 'mobileFriendly' | 'securityHeaders', url: string): Promise<T> {
  if (!isSupabaseConfigured) {
    throw new SiteInspectorError('Backend not connected yet — this needs Supabase configured.')
  }

  const session = getCachedSession() ?? (await loginWithTelegram())
  if (!session) {
    throw new SiteInspectorError('Open this inside Telegram to use tools that fetch external sites.')
  }

  const endpoint = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/site-inspector`
  let res: Response
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, url }),
    })
  } catch {
    throw new SiteInspectorError('Could not reach the site inspector function.')
  }

  const responseBody = await res.json().catch(() => ({}))
  if (!res.ok) throw new SiteInspectorError(responseBody.error ?? `Request failed (${res.status}).`)
  return responseBody.data as T
}
