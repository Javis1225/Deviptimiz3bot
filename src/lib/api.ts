import { supabase } from './supabase'

const functionsUrl = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
  : ''

export async function authWithTelegram(initData: string) {
  if (!functionsUrl) {
    return { error: 'Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' }
  }
  const res = await fetch(`${functionsUrl}/telegram-auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData }),
  })
  return res.json()
}

export async function awardPoint(initData: string, monetagEventId?: string) {
  if (!functionsUrl) {
    return { error: 'Supabase not configured. Set env vars on Vercel to enable points.' }
  }
  const res = await fetch(`${functionsUrl}/award-points`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData, monetagEventId, provider: 'monetag' }),
  })
  return res.json()
}

export async function fetchRewardHistory(userId: string) {
  if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
  const { data, error } = await supabase
    .from('points_transactions')
    .select('id, amount, type, description, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
  return { data, error }
}
