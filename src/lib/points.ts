import { supabase, isSupabaseConfigured } from './supabaseClient'
import { getCachedSession, loginWithTelegram } from './session'

export interface PointsState {
  status: 'no-backend' | 'signed-out' | 'ready'
  balance: number | null
}

/**
 * Reads the signed-in user's points balance via the telegram-auth session
 * (see src/lib/session.ts). Never reads or writes points_balance in a way
 * that bypasses the server — this only ever reads the caller's own row,
 * enforced by RLS in supabase/schema.sql.
 */
export async function getMyPoints(): Promise<PointsState> {
  if (!supabase || !isSupabaseConfigured) return { status: 'no-backend', balance: null }

  const session = getCachedSession() ?? (await loginWithTelegram())
  if (!session) return { status: 'signed-out', balance: null }

  // The session's own upsert response already carries points_balance, so we
  // can show it immediately without a second round trip.
  if (typeof session.user.points_balance === 'number') {
    return { status: 'ready', balance: session.user.points_balance }
  }
  return { status: 'signed-out', balance: null }
}

/**
 * Tells the server "this user watched an ad" so it can open a pending
 * reward_events row. This does NOT credit points by itself — Monetag's
 * server-to-server postback verifies the view and calls award_points()
 * separately. See src/lib/monetag.ts and supabase/schema.sql.
 *
 * NOTE: the claim-ad-reward Edge Function itself is not built yet (it's the
 * next backend piece, alongside the Monetag postback handler) — this call
 * will 404 until then. It's wired up now so nothing else needs to change
 * once that function ships.
 */
export async function claimAdReward(): Promise<{ ok: boolean; message: string }> {
  if (!isSupabaseConfigured) return { ok: false, message: 'Backend not connected yet.' }

  const session = getCachedSession() ?? (await loginWithTelegram())
  if (!session) return { ok: false, message: 'Open this inside Telegram to earn points.' }

  try {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/claim-ad-reward`
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    if (!res.ok) return { ok: false, message: `Reward request failed (${res.status}) \u2014 claim-ad-reward isn't deployed yet.` }
    return { ok: true, message: 'Ad recorded \u2014 points will appear once verified.' }
  } catch {
    return { ok: false, message: 'Could not reach the reward endpoint.' }
  }
}
