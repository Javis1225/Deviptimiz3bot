// supabase/functions/telegram-auth/index.ts
//
// Verifies Telegram Mini App initData (per Telegram's documented HMAC-SHA256
// scheme), upserts the user via a SECURITY DEFINER function, and returns a
// short-lived Supabase-compatible JWT the client can use as a bearer token
// for RLS-scoped requests.
//
// Required secrets (set with `supabase secrets set NAME=value`):
//   TELEGRAM_BOT_TOKEN        - from @BotFather
//   SUPABASE_SERVICE_ROLE_KEY - Project Settings -> API -> service_role
//   SUPABASE_JWT_SECRET       - Project Settings -> API -> JWT Settings
// SUPABASE_URL is provided automatically inside Edge Functions.
//
// TRADE-OFF WORTH KNOWING: this issues a hand-signed JWT with claims that
// match what Supabase's Postgres role expects (sub/role/aud/exp), not a
// "real" Supabase Auth session — there is no refresh token. It's valid for
// SESSION_TTL_SECONDS; the client should just call this function again with
// fresh Telegram initData to get a new one, rather than trying to refresh.
//
// Deploy with: supabase functions deploy telegram-auth --no-verify-jwt
// (--no-verify-jwt is required because the caller has no user session yet —
// this function IS the login step. It still requires the project's anon key
// in the Authorization header, which is public and safe to ship to clients.)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/http.ts'

const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const JWT_SECRET = Deno.env.get('SUPABASE_JWT_SECRET') ?? ''

const MAX_AUTH_AGE_SECONDS = 24 * 60 * 60 // reject stale initData (replay protection)
const SESSION_TTL_SECONDS = 60 * 60

const encoder = new TextEncoder()

async function hmacSha256(key: BufferSource, message: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message))
}

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function base64url(input: ArrayBuffer | string): string {
  const bytes = typeof input === 'string' ? encoder.encode(input) : new Uint8Array(input)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

interface TelegramInitDataUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

async function verifyInitData(initData: string): Promise<
  { valid: true; user: TelegramInitDataUser } | { valid: false; reason: string }
> {
  if (!BOT_TOKEN) return { valid: false, reason: 'TELEGRAM_BOT_TOKEN is not configured on the server' }

  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return { valid: false, reason: 'missing hash field' }
  params.delete('hash')

  // Per Telegram's docs: sort remaining fields alphabetically, join as
  // "key=value" lines, then HMAC-SHA256 twice as below.
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  const secretKey = await hmacSha256(encoder.encode('WebAppData'), BOT_TOKEN)
  const computed = toHex(await hmacSha256(secretKey, dataCheckString))

  if (computed.length !== hash.length || computed !== hash) {
    return { valid: false, reason: 'hash mismatch \u2014 initData may be forged or the bot token is wrong' }
  }

  const authDate = Number(params.get('auth_date') ?? '0')
  if (!authDate || Date.now() / 1000 - authDate > MAX_AUTH_AGE_SECONDS) {
    return { valid: false, reason: 'initData has expired \u2014 re-open the Mini App to refresh it' }
  }

  const userRaw = params.get('user')
  if (!userRaw) return { valid: false, reason: 'missing user field' }

  try {
    return { valid: true, user: JSON.parse(userRaw) }
  } catch {
    return { valid: false, reason: 'user field was not valid JSON' }
  }
}

async function signSupabaseCompatibleJwt(userId: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    sub: userId,
    role: 'authenticated',
    aud: 'authenticated',
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  }
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`
  const signature = base64url(await hmacSha256(encoder.encode(JWT_SECRET), unsigned))
  return `${unsigned}.${signature}`
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405)

  let initData: unknown
  try {
    ;({ initData } = await req.json())
  } catch {
    return json({ error: 'Expected JSON body: { "initData": "..." }' }, 400)
  }
  if (typeof initData !== 'string' || !initData) {
    return json({ error: 'initData (string) is required' }, 400)
  }

  const verification = await verifyInitData(initData)
  if (!verification.valid) {
    return json({ error: `Telegram verification failed: ${verification.reason}` }, 401)
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !JWT_SECRET) {
    return json({ error: 'Server misconfiguration: missing service role key or JWT secret' }, 500)
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
  const { data: user, error } = await admin
    .rpc('upsert_telegram_user', {
      p_telegram_id: verification.user.id,
      p_telegram_username: verification.user.username ?? null,
      p_first_name: verification.user.first_name,
      p_last_name: verification.user.last_name ?? null,
      p_photo_url: verification.user.photo_url ?? null,
    })
    .single()

  if (error || !user) {
    return json({ error: `Could not create/update user: ${error?.message ?? 'unknown error'}` }, 500)
  }

  const accessToken = await signSupabaseCompatibleJwt((user as { id: string }).id)
  return json({ access_token: accessToken, expires_in: SESSION_TTL_SECONDS, user })
})
