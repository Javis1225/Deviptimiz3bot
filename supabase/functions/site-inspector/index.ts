// supabase/functions/site-inspector/index.ts
//
// Backs two tools that need to fetch and inspect a *remote* URL — something
// a browser can't do directly due to CORS. This function does the fetch
// server-side instead. No third-party API key is needed here (unlike
// youtube-data); the only "credential" is this server's ability to make
// outbound HTTP requests, which is why the SSRF guards below matter more
// than usual — this endpoint will fetch whatever URL an authenticated user
// gives it.
//
// Deploy with default JWT verification ON (no --no-verify-jwt) — same
// reasoning as youtube-data: only signed-in clients should be able to make
// this server issue arbitrary outbound requests.

import { corsHeaders, json } from '../_shared/http.ts'

const FETCH_TIMEOUT_MS = 8000
const MAX_BODY_BYTES = 2_000_000 // 2MB — plenty for HTML, avoids abuse via huge responses

const BLOCKED_HOSTNAMES = new Set(['localhost', '0.0.0.0', '169.254.169.254' /* cloud metadata endpoints */])

function isPrivateIp(hostname: string): boolean {
  const parts = hostname.split('.').map(Number)
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p))) return false
  const [a, b] = parts
  return (
    a === 10 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a === 127 ||
    (a === 169 && b === 254)
  )
}

function assertSafeUrl(raw: string): URL {
  const url = new URL(raw)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Only http/https URLs are allowed.')
  }
  if (BLOCKED_HOSTNAMES.has(url.hostname) || isPrivateIp(url.hostname) || url.hostname.endsWith('.internal')) {
    throw new Error('That host cannot be inspected from here.')
  }
  return url
}

async function fetchWithLimits(url: URL): Promise<{ status: number; headers: Headers; body: string }> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'DevOptimizeBot-SiteInspector/1.0 (+https://devoptimizebot.app)' },
    })
    const reader = res.body?.getReader()
    let received = 0
    let text = ''
    const decoder = new TextDecoder()
    if (reader) {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        received += value.length
        if (received > MAX_BODY_BYTES) {
          controller.abort()
          break
        }
        text += decoder.decode(value, { stream: true })
      }
    }
    return { status: res.status, headers: res.headers, body: text }
  } finally {
    clearTimeout(timeout)
  }
}

function checkMobileFriendly(html: string) {
  const viewportMatch = html.match(/<meta[^>]+name=["']viewport["'][^>]*>/i)
  const viewportContent = viewportMatch?.[0].match(/content=["']([^"']+)["']/i)?.[1] ?? null
  const hasDeviceWidth = Boolean(viewportContent?.includes('width=device-width'))
  const hasSrcset = /srcset=/i.test(html)
  const tinyFixedFont = /font-size:\s*(?:[4-9]|1[0-1])px/i.test(html)

  const checks = [
    { label: 'Has a viewport meta tag', pass: Boolean(viewportMatch) },
    { label: 'Viewport uses width=device-width', pass: hasDeviceWidth },
    { label: 'No obviously tiny fixed font sizes found', pass: !tinyFixedFont },
    { label: 'Uses responsive images (srcset)', pass: hasSrcset, informational: true },
  ]
  return { viewportContent, checks }
}

function checkSecurityHeaders(headers: Headers) {
  const wanted = [
    { key: 'content-security-policy', label: 'Content-Security-Policy' },
    { key: 'strict-transport-security', label: 'Strict-Transport-Security' },
    { key: 'x-content-type-options', label: 'X-Content-Type-Options' },
    { key: 'x-frame-options', label: 'X-Frame-Options' },
    { key: 'referrer-policy', label: 'Referrer-Policy' },
    { key: 'permissions-policy', label: 'Permissions-Policy' },
  ]
  return wanted.map((w) => ({ label: w.label, present: headers.has(w.key), value: headers.get(w.key) }))
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405)

  let body: { action?: string; url?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Expected JSON body: { "action": "...", "url": "..." }' }, 400)
  }

  if (!body.url) return json({ error: 'url is required' }, 400)

  let target: URL
  try {
    target = assertSafeUrl(body.url)
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Invalid URL' }, 400)
  }

  try {
    const { status, headers, body: html } = await fetchWithLimits(target)

    if (body.action === 'mobileFriendly') {
      return json({ data: { status, ...checkMobileFriendly(html) } })
    }
    if (body.action === 'securityHeaders') {
      return json({ data: { status, headers: checkSecurityHeaders(headers) } })
    }
    return json({ error: `Unknown action "${body.action}". Valid: mobileFriendly, securityHeaders` }, 400)
  } catch (err) {
    const message = err instanceof Error && err.name === 'AbortError' ? 'Request timed out or response was too large.' : (err as Error).message
    return json({ error: message }, 502)
  }
})
