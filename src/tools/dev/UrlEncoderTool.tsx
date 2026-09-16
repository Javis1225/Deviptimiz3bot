import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

export default function UrlEncoderTool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [full, setFull] = useState(false) // encodeURI vs encodeURIComponent
  const [input, setInput] = useState('https://example.com/search?q=dev optimize bot')

  const { output, error } = useMemo(() => {
    try {
      if (mode === 'encode') return { output: full ? encodeURI(input) : encodeURIComponent(input), error: null as string | null }
      return { output: full ? decodeURI(input) : decodeURIComponent(input), error: null as string | null }
    } catch {
      return { output: '', error: 'Could not decode — check for malformed % sequences.' }
    }
  }, [input, mode, full])

  function flip() {
    setMode((m) => (m === 'encode' ? 'decode' : 'encode'))
    setInput(output || input)
  }

  return (
    <ToolShell title="URL Encoder & Decoder" description="Percent-encode or decode text and URLs.">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-white/50">Input</label>
        <button type="button" onClick={flip} className="btn-secondary">
          Swap direction
        </button>
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} className="field mt-1 font-mono text-sm" />

      <label className="mt-2 flex items-center gap-2 text-xs text-white/50">
        <input type="checkbox" checked={full} onChange={(e) => setFull(e.target.checked)} />
        Whole URL mode (keep :/?&= unescaped)
      </label>

      {error ? (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      ) : (
        <>
          <div className="mt-3 flex items-center justify-between">
            <label className="text-xs font-medium text-white/50">{mode === 'encode' ? 'Encoded' : 'Decoded'}</label>
            <CopyButton text={output} />
          </div>
          <textarea value={output} readOnly rows={4} className="field mt-1 font-mono text-sm" />
        </>
      )}
    </ToolShell>
  )
}
