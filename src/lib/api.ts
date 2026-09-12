import { supabase } from './supabase'

const functionsUrl = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
  : ''

export async function authWithTelegram(initData: string) {
  const res = await fetch(`${functionsUrl}/telegram-auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData }),
  })
  return res.json()
}

export async function awardPoint(initData: string, monetagEventId?: string) {
  const res = await fetch(`${functionsUrl}/award-points`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData, monetagEventId, provider: 'monetag' }),
  })
  return res.json()
}

export async function fetchRewardHistory(userId: string) {
  const { data, error } = await supabase
    .from('points_transactions')
    .select('id, amount, type, description, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
  return { data, error }
}
