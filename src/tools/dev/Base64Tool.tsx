import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

function encodeBase64(text: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(text)))
}

function decodeBase64(b64: string): string {
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export default function Base64Tool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [input, setInput] = useState('DevOptimizeBot')

  const { output, error } = useMemo(() => {
    try {
      return { output: mode === 'encode' ? encodeBase64(input) : decodeBase64(input), error: null as string | null }
    } catch {
      return { output: '', error: 'Invalid Base64 input.' }
    }
  }, [input, mode])

  function flip() {
    setMode((m) => (m === 'encode' ? 'decode' : 'encode'))
    setInput(output || input)
  }

  return (
    <ToolShell title="Base64 Encoder & Decoder" description="Encode text to Base64, or decode Base64 back to text.">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-white/50">{mode === 'encode' ? 'Text' : 'Base64'}</label>
        <button type="button" onClick={flip} className="btn-secondary">
          Swap direction
        </button>
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={5} className="field mt-1 font-mono text-sm" />

      {error ? (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      ) : (
        <>
          <div className="mt-3 flex items-center justify-between">
            <label className="text-xs font-medium text-white/50">{mode === 'encode' ? 'Base64' : 'Text'}</label>
            <CopyButton text={output} />
          </div>
          <textarea value={output} readOnly rows={5} className="field mt-1 font-mono text-sm" />
        </>
      )}
    </ToolShell>
  )
}
