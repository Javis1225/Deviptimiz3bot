import { useEffect, useRef, useState } from 'react'
import ToolShell from '../../components/ToolShell'

export default function PlaceholderImageGenerator() {
  const [width, setWidth] = useState(600)
  const [height, setHeight] = useState(400)
  const [bg, setBg] = useState('#182A52')
  const [fg, setFg] = useState('#FFC531')
  const [label, setLabel] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = fg
    ctx.font = `${Math.max(14, Math.round(Math.min(width, height) / 8))}px Inter, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label || `${width} × ${height}`, width / 2, height / 2)

    setDataUrl(canvas.toDataURL('image/png'))
  }, [width, height, bg, fg, label])

  return (
    <ToolShell title="Placeholder Image Generator" description="Generate a placeholder image with a custom size, color and label.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Width" value={width} onChange={setWidth} />
        <Field label="Height" value={height} onChange={setHeight} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-xs text-white/50">
          Background
          <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-8 w-8 cursor-pointer rounded border border-white/15 bg-transparent" />
        </label>
        <label className="flex items-center gap-2 text-xs text-white/50">
          Text
          <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-8 w-8 cursor-pointer rounded border border-white/15 bg-transparent" />
        </label>
      </div>

      <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Custom label (optional)" className="field mt-3" />

      <div className="mt-4 overflow-auto rounded-lg border border-white/10 bg-navy-950 p-3">
        <canvas ref={canvasRef} className="max-w-full" style={{ maxHeight: 260 }} />
      </div>

      {dataUrl && (
        <a href={dataUrl} download={`placeholder-${width}x${height}.png`} className="btn-secondary mt-3">
          Download PNG
        </a>
      )}
    </ToolShell>
  )
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <label className="text-xs text-white/50">{label}</label>
      <input type="number" min={16} max={2000} value={value} onChange={(e) => onChange(Math.max(16, Math.min(2000, Number(e.target.value) || 16)))} className="field mt-1" />
    </div>
  )
}
