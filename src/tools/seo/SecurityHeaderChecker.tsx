import { useState } from 'react'
import { Check, X } from 'lucide-react'
import ToolShell from '../../components/ToolShell'
import { inspectSite, SiteInspectorError } from '../../lib/siteInspector'

interface HeaderResult {
  status: number
  headers: { label: string; present: boolean; value: string | null }[]
}

export default function SecurityHeaderChecker() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<HeaderResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function run() {
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      setResult(await inspectSite<HeaderResult>('securityHeaders', url.trim()))
    } catch (err) {
      setError(err instanceof SiteInspectorError ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const score = result ? result.headers.filter((h) => h.present).length : 0

  return (
    <ToolShell title="HTTP Security Header Checker" description="Checks a site's response for common security headers.">
      <div className="flex gap-2">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="field" onKeyDown={(e) => e.key === 'Enter' && run()} />
        <button type="button" onClick={run} disabled={loading} className="btn-primary shrink-0">
          {loading ? 'Checking…' : 'Check'}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {result && (
        <div className="mt-4">
          <p className="mb-2 text-sm text-white/60">{score} of {result.headers.length} headers present</p>
          <div className="flex flex-col gap-2">
            {result.headers.map((h) => (
              <div key={h.label} className="rounded-lg border border-white/10 bg-navy-950 p-3">
                <div className="flex items-center gap-2">
                  {h.present ? <Check size={16} className="text-emerald-400" /> : <X size={16} className="text-red-400" />}
                  <span className="text-sm text-white/80">{h.label}</span>
                </div>
                {h.value && <p className="mt-1 truncate pl-6 font-mono text-xs text-white/40">{h.value}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolShell>
  )
}
