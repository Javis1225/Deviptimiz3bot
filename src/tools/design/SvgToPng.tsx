import { useRef, useState } from 'react'
import ToolShell from '../../components/ToolShell'

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <rect width="200" height="200" rx="24" fill="#182A52"/>
  <circle cx="100" cy="100" r="60" fill="#FFC531"/>
</svg>`

export default function SvgToPng() {
  const [svgText, setSvgText] = useState(SAMPLE_SVG)
  const [scale, setScale] = useState(2)
  const [pngUrl, setPngUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = () => setSvgText(String(reader.result ?? ''))
    reader.readAsText(file)
  }

  function convert() {
    setError(null)
    setPngUrl(null)
    try {
      const parsed = new DOMParser().parseFromString(svgText, 'image/svg+xml')
      if (parsed.querySelector('parsererror')) throw new Error('That SVG could not be parsed.')

      const svgEl = parsed.documentElement
      const width = Number(svgEl.getAttribute('width')) || 300
      const height = Number(svgEl.getAttribute('height')) || 300

      const blob = new Blob([svgText], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.width = width * scale
        canvas.height = height * scale
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        setPngUrl(canvas.toDataURL('image/png'))
        URL.revokeObjectURL(url)
      }
      img.onerror = () => setError('Could not render that SVG.')
      img.src = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed.')
    }
  }

  return (
    <ToolShell title="SVG to PNG Converter" description="Paste SVG markup or upload a file, then export a PNG.">
      <input
        type="file"
        accept=".svg,image/svg+xml"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="mb-2 block text-xs text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:text-white"
      />
      <textarea value={svgText} onChange={(e) => setSvgText(e.target.value)} rows={6} className="field font-mono text-xs" />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-white/50">
          Scale
          <select value={scale} onChange={(e) => setScale(Number(e.target.value))} className="field w-auto py-1.5">
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={4}>4x</option>
          </select>
        </label>
        <button type="button" onClick={convert} className="btn-primary">
          Convert to PNG
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <canvas ref={canvasRef} className="hidden" />
      {pngUrl && (
        <div className="mt-4 flex items-center gap-4 rounded-lg border border-white/10 bg-navy-950 p-3">
          <img src={pngUrl} alt="Converted PNG preview" className="h-20 w-20 rounded border border-white/10 object-contain" />
          <a href={pngUrl} download="converted.png" className="btn-secondary">
            Download PNG
          </a>
        </div>
      )}
    </ToolShell>
  )
}
