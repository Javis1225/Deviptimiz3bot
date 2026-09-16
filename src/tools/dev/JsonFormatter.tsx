import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

export default function JsonFormatter() {
  const [input, setInput] = useState('{"name":"DevOptimizeBot","tools":121,"active":true}')
  const [indent, setIndent] = useState(2)

  const { formatted, error } = useMemo(() => {
    if (!input.trim()) return { formatted: '', error: null }
    try {
      return { formatted: JSON.stringify(JSON.parse(input), null, indent), error: null }
    } catch (err) {
      return { formatted: '', error: err instanceof Error ? err.message : 'Invalid JSON' }
    }
  }, [input, indent])

  function minify() {
    try {
      setInput(JSON.stringify(JSON.parse(input)))
    } catch {
      /* leave input as-is if invalid */
    }
  }

  return (
    <ToolShell title="JSON Formatter & Validator" description="Format, validate and minify JSON.">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="field font-mono text-sm" />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-white/50">
          Indent
          <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="field w-auto py-1.5">
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={0}>Tabs-free (0)</option>
          </select>
        </label>
        <button type="button" onClick={minify} className="btn-secondary">
          Minify in place
        </button>
        {!error && input.trim() && <span className="text-xs text-emerald-400">Valid JSON</span>}
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-400">Invalid JSON: {error}</p>
      ) : (
        <>
          <div className="mt-3 flex justify-end">
            <CopyButton text={formatted} />
          </div>
          <textarea value={formatted} readOnly rows={10} className="field mt-1 font-mono text-sm" />
        </>
      )}
    </ToolShell>
  )
}
