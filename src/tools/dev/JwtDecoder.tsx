import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

function base64UrlDecode(segment: string): string {
  const padded = segment.replace(/-/g, '+').replace(/_/g, '/').padEnd(segment.length + ((4 - (segment.length % 4)) % 4), '=')
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function decodeJwt(token: string) {
  const parts = token.trim().split('.')
  if (parts.length < 2) throw new Error('A JWT needs at least a header and payload, separated by dots.')
  const header = JSON.parse(base64UrlDecode(parts[0]))
  const payload = JSON.parse(base64UrlDecode(parts[1]))
  return { header, payload, signature: parts[2] ?? '' }
}

const SAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldk9wdGltaXplQm90IiwiaWF0IjoxNTE2MjM5MDIyfQ.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U'

export default function JwtDecoder() {
  const [token, setToken] = useState(SAMPLE)

  const result = useMemo(() => {
    try {
      return { data: decodeJwt(token), error: null as string | null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Could not decode this token' }
    }
  }, [token])

  return (
    <ToolShell title="JWT Decoder" description="Decode a JWT's header and payload. This does not verify the signature — that requires the signing secret.">
      <textarea value={token} onChange={(e) => setToken(e.target.value)} rows={4} className="field font-mono text-xs" placeholder="Paste a JWT..." />

      {result.error ? (
        <p className="mt-3 text-sm text-red-400">{result.error}</p>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <JsonBlock title="Header" value={result.data!.header} />
          <JsonBlock title="Payload" value={result.data!.payload} />
        </div>
      )}
    </ToolShell>
  )
}

function JsonBlock({ title, value }: { title: string; value: unknown }) {
  const text = JSON.stringify(value, null, 2)
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-white/50">{title}</label>
        <CopyButton text={text} />
      </div>
      <pre className="field mt-1 overflow-x-auto whitespace-pre-wrap font-mono text-xs">{text}</pre>
    </div>
  )
}
