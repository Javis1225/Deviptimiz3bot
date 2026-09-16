import { getTelegramInitData } from './telegram'

export interface AppSession {
  accessToken: string
  expiresAt: number // epoch seconds
  user: { id: string; telegram_id: number; first_name: string; points_balance: number; [key: string]: unknown }
}

let cached: AppSession | null = null
let inFlight: Promise<AppSession | null> | null = null

/**
 * Exchanges Telegram's initData for a short-lived token by calling the
 * telegram-auth Edge Function. Reuses a still-valid cached session or an
 * in-flight request rather than re-authenticating on every call — safe to
 * call from multiple places (e.g. on boot, and again before any points
 * action) without spamming the Edge Function.
 *
 * Returns null when there's nothing to authenticate with yet: outside
 * Telegram, or before VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set.
 */
export async function loginWithTelegram(): Promise<AppSession | null> {
  const now = Math.floor(Date.now() / 1000)
  if (cached && cached.expiresAt - 30 > now) return cached
  if (inFlight) return inFlight

  const initData = getTelegramInitData()
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  if (!initData || !supabaseUrl || !anonKey) return null

  inFlight = (async () => {
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/telegram-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${anonKey}`,
          apikey: anonKey,
        },
        body: JSON.stringify({ initData }),
      })
      if (!res.ok) {
        console.warn('[session] telegram-auth returned', res.status)
        return null
      }
      const body = await res.json()
      cached = {
        accessToken: body.access_token,
        expiresAt: now + (body.expires_in ?? 3600),
        user: body.user,
      }
      return cached
    } catch (err) {
      console.warn('[session] could not reach telegram-auth:', err)
      return null
    } finally {
      inFlight = null
    }
  })()

  return inFlight
}

/** Synchronous — returns whatever session is currently cached, or null. */
export function getCachedSession(): AppSession | null {
  return cached
}
