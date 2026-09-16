import { getCachedSession, loginWithTelegram } from './session'
import { isSupabaseConfigured } from './supabaseClient'

export class AdminApiError extends Error {}

async function getAuthHeaders(): Promise<{ Authorization: string; apikey: string } | null> {
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  if (!isSupabaseConfigured || !anonKey) return null
  const session = getCachedSession() ?? (await loginWithTelegram())
  if (!session) return null
  return { Authorization: `Bearer ${session.accessToken}`, apikey: anonKey }
}

async function restFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = await getAuthHeaders()
  if (!headers) throw new AdminApiError('Not signed in — open this inside Telegram first.')

  const mergedHeaders: Record<string, string> = {
    ...headers,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
    ...(init?.headers as Record<string, string> | undefined),
  }

  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/${path}`, { ...init, headers: mergedHeaders })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new AdminApiError(body.message ?? `Request failed (${res.status}).`)
  }
  return res.json()
}

/** Calls the is_admin() Postgres function — returns false for any error rather than throwing, since "not an admin" and "couldn't check" should look the same to the UI (fail closed). */
export async function checkIsAdmin(): Promise<boolean> {
  try {
    const headers = await getAuthHeaders()
    if (!headers) return false
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/is_admin`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: '{}',
    })
    if (!res.ok) return false
    return (await res.json()) === true
  } catch {
    return false
  }
}

export interface AdminUserRow {
  id: string
  telegram_username: string | null
  first_name: string | null
  points_balance: number
  created_at: string
  last_seen_at: string
}

export async function listUsers(limit = 50): Promise<AdminUserRow[]> {
  return restFetch<AdminUserRow[]>(`users?select=id,telegram_username,first_name,points_balance,created_at,last_seen_at&order=last_seen_at.desc&limit=${limit}`)
}

export interface AdminRewardEvent {
  id: string
  user_id: string
  type: string
  status: 'pending' | 'verified' | 'rejected'
  points_awarded: number
  created_at: string
  verified_at: string | null
  users: { telegram_username: string | null; first_name: string | null } | null
}

export async function listRewardEvents(limit = 50): Promise<AdminRewardEvent[]> {
  return restFetch<AdminRewardEvent[]>(
    `reward_events?select=id,user_id,type,status,points_awarded,created_at,verified_at,users(telegram_username,first_name)&order=created_at.desc&limit=${limit}`,
  )
}

export interface AppSettingRow {
  key: string
  value: unknown
  updated_at: string
}

export async function listSettings(): Promise<AppSettingRow[]> {
  return restFetch<AppSettingRow[]>('app_settings?select=*&order=key.asc')
}

export async function updateSetting(key: string, value: unknown): Promise<void> {
  await restFetch(`app_settings?key=eq.${encodeURIComponent(key)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ value, updated_at: new Date().toISOString() }),
  })
}

async function countRows(table: string, filter = ''): Promise<number> {
  const headers = await getAuthHeaders()
  if (!headers) throw new AdminApiError('Not signed in.')
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/${table}?select=id${filter}`, {
    method: 'HEAD',
    headers: { ...headers, Prefer: 'count=exact' },
  })
  if (!res.ok) throw new AdminApiError(`Could not count ${table} (${res.status}).`)
  const range = res.headers.get('content-range') // format: "0-9/123"
  return range ? Number(range.split('/')[1]) : 0
}

export interface AdminOverview {
  totalUsers: number
  totalToolUses: number
  pendingRewards: number
  verifiedRewards: number
}

export async function getOverview(): Promise<AdminOverview> {
  const [totalUsers, totalToolUses, pendingRewards, verifiedRewards] = await Promise.all([
    countRows('users'),
    countRows('tool_usage'),
    countRows('reward_events', '&status=eq.pending'),
    countRows('reward_events', '&status=eq.verified'),
  ])
  return { totalUsers, totalToolUses, pendingRewards, verifiedRewards }
}
