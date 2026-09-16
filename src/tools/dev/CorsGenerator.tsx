import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']

export default function CorsGenerator() {
  const [origin, setOrigin] = useState('https://example.com')
  const [methods, setMethods] = useState<string[]>(['GET', 'POST'])
  const [headers, setHeaders] = useState('Content-Type, Authorization')
  const [credentials, setCredentials] = useState(false)

  function toggleMethod(m: string) {
    setMethods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]))
  }

  const rawHeaders = useMemo(() => {
    const lines = [
      `Access-Control-Allow-Origin: ${origin || '*'}`,
      `Access-Control-Allow-Methods: ${methods.join(', ')}`,
      `Access-Control-Allow-Headers: ${headers}`,
    ]
    if (credentials) lines.push('Access-Control-Allow-Credentials: true')
    return lines.join('\n')
  }, [origin, methods, headers, credentials])

  const expressSnippet = `app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '${origin || '*'}');
  res.setHeader('Access-Control-Allow-Methods', '${methods.join(', ')}');
  res.setHeader('Access-Control-Allow-Headers', '${headers}');${credentials ? "\n  res.setHeader('Access-Control-Allow-Credentials', 'true');" : ''}
  next();
});`

  const nginxSnippet = `add_header 'Access-Control-Allow-Origin' '${origin || '*'}' always;
add_header 'Access-Control-Allow-Methods' '${methods.join(', ')}' always;
add_header 'Access-Control-Allow-Headers' '${headers}' always;${credentials ? "\nadd_header 'Access-Control-Allow-Credentials' 'true' always;" : ''}`

  return (
    <ToolShell title="CORS Configuration Generator" description="Build CORS headers and copy-paste snippets for Express or Nginx.">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs text-white/50">Allowed origin</label>
          <input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="* or https://example.com" className="field mt-1" />
        </div>
        <div>
          <label className="text-xs text-white/50">Allowed headers</label>
          <input value={headers} onChange={(e) => setHeaders(e.target.value)} className="field mt-1" />
        </div>
      </div>

      <div className="mt-3">
        <label className="text-xs text-white/50">Allowed methods</label>
        <div className="mt-1 flex flex-wrap gap-2">
          {METHODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => toggleMethod(m)}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                methods.includes(m) ? 'border-accent-400 bg-accent-400 text-accent-ink' : 'border-white/15 text-white/60'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <label className="mt-3 flex items-center gap-2 text-xs text-white/50">
        <input type="checkbox" checked={credentials} onChange={(e) => setCredentials(e.target.checked)} />
        Allow credentials (cookies / auth headers)
      </label>

      <SnippetBlock title="Raw headers" code={rawHeaders} />
      <SnippetBlock title="Express.js middleware" code={expressSnippet} />
      <SnippetBlock title="Nginx" code={nginxSnippet} />
    </ToolShell>
  )
}

function SnippetBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-white/50">{title}</label>
        <CopyButton text={code} />
      </div>
      <pre className="field mt-1 overflow-x-auto whitespace-pre font-mono text-xs">{code}</pre>
    </div>
  )
}
