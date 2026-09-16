import { useState } from 'react'
import { Check, X } from 'lucide-react'
import ToolShell from '../../components/ToolShell'
import { inspectSite, SiteInspectorError } from '../../lib/siteInspector'

interface MobileFriendlyResult {
  status: number
  viewportContent: string | null
  checks: { label: string; pass: boolean; informational?: boolean }[]
}

export default function MobileFriendlyTester() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<MobileFriendlyResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function run() {
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      setResult(await inspectSite<MobileFriendlyResult>('mobileFriendly', url.trim()))
    } catch (err) {
      setError(err instanceof SiteInspectorError ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolShell
      title="Mobile-Friendly Tester"
      description="Checks the HTML signals a page controls directly (viewport tag, font sizes). This is static analysis, not a full rendering-based test like a real device or browser would give you."
    >
      <div className="flex gap-2">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="field" onKeyDown={(e) => e.key === 'Enter' && run()} />
        <button type="button" onClick={run} disabled={loading} className="btn-primary shrink-0">
          {loading ? 'Checking…' : 'Check'}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {result && (
        <div className="mt-4 flex flex-col gap-2">
          {result.checks.map((check) => (
            <div key={check.label} className="flex items-center gap-2 rounded-lg border border-white/10 bg-navy-950 p-3">
              {check.pass ? <Check size={16} className="text-emerald-400" /> : <X size={16} className={check.informational ? 'text-white/30' : 'text-red-400'} />}
              <span className="text-sm text-white/70">{check.label}</span>
            </div>
          ))}
          {result.viewportContent && <p className="text-xs text-white/40">Viewport tag content: {result.viewportContent}</p>}
        </div>
      )}
    </ToolShell>
  )
}
