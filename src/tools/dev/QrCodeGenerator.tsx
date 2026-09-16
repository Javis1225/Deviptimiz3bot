import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import ToolShell from '../../components/ToolShell'

const ERROR_LEVELS = ['L', 'M', 'Q', 'H'] as const

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://devoptimizebot.app')
  const [size, setSize] = useState(256)
  const [errorLevel, setErrorLevel] = useState<(typeof ERROR_LEVELS)[number]>('M')
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!text) {
      setDataUrl(null)
      return
    }
    let cancelled = false
    QRCode.toDataURL(text, { width: size, errorCorrectionLevel: errorLevel, margin: 1 })
      .then((url) => {
        if (!cancelled) {
          setDataUrl(url)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not generate a QR code for that input.')
      })
    return () => {
      cancelled = true
    }
  }, [text, size, errorLevel])

  return (
    <ToolShell title="QR Code Generator" description="Generate a QR code for a URL or any text.">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className="field font-mono text-sm" placeholder="URL or text..." />

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-xs text-white/50">
          Size
          <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="field w-auto py-1.5">
            <option value={128}>128px</option>
            <option value={256}>256px</option>
            <option value={512}>512px</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs text-white/50">
          Error correction
          <select value={errorLevel} onChange={(e) => setErrorLevel(e.target.value as typeof errorLevel)} className="field w-auto py-1.5">
            {ERROR_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {dataUrl && (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-lg border border-white/10 bg-white p-4">
          <img src={dataUrl} alt="Generated QR code" width={size > 256 ? 256 : size} height={size > 256 ? 256 : size} />
        </div>
      )}
      {dataUrl && (
        <a href={dataUrl} download="qr-code.png" className="btn-secondary mt-3">
          Download PNG
        </a>
      )}
    </ToolShell>
  )
}
