// Supabase's Edge Runtime already verifies the JWT signature and expiry at
// the gateway level before invoking a function deployed WITHOUT
// --no-verify-jwt (the default). By the time function code runs, the
// Authorization header is guaranteed to carry a validly-signed token, so
// this just decodes the payload to read claims — it does not need to
// re-verify the signature itself.

export function getUserIdFromRequest(req: Request): string | null {
  const auth = req.headers.get('Authorization') ?? ''
  const token = auth.replace(/^Bearer\s+/i, '')
  if (!token || token.split('.').length !== 3) return null

  try {
    const payloadSegment = token.split('.')[1]
    const padded = payloadSegment.replace(/-/g, '+').replace(/_/g, '/').padEnd(payloadSegment.length + ((4 - (payloadSegment.length % 4)) % 4), '=')
    const payload = JSON.parse(atob(padded))
    return typeof payload.sub === 'string' ? payload.sub : null
  } catch {
    return null
  }
}
