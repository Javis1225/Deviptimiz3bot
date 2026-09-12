/**
 * Validate Telegram Mini App initData (HMAC-SHA256).
 * Secret = HMAC_SHA256(bot_token, "WebAppData")
 */
export async function validateInitData(initData: string, botToken: string): Promise<{
  ok: boolean
  user?: any
  error?: string
}> {
  if (!initData || !botToken) return { ok: false, error: 'Missing initData or bot token' }

  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return { ok: false, error: 'Missing hash' }

  params.delete('hash')
  const entries = [...params.entries()].sort(([a], [b]) => a.localeCompare(b))
  const dataCheckString = entries.map(([k, v]) => `${k}=${v}`).join('\n')

  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode('WebAppData'),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const secretBuf = await crypto.subtle.sign('HMAC', key, enc.encode(botToken))
  const secretKey = await crypto.subtle.importKey(
    'raw',
    secretBuf,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', secretKey, enc.encode(dataCheckString))
  const hex = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')

  if (hex !== hash) return { ok: false, error: 'Invalid hash' }

  const authDate = Number(params.get('auth_date') || 0)
  if (authDate && Date.now() / 1000 - authDate > 86400) {
    return { ok: false, error: 'initData expired' }
  }

  let user
  try {
    user = JSON.parse(params.get('user') || 'null')
  } catch {
    user = null
  }
  return { ok: true, user }
}
