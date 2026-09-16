import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

export default function ImageAspectRatioCalculator() {
  const [width, setWidth] = useState(1920)
  const [height, setHeight] = useState(1080)
  const [newWidth, setNewWidth] = useState(800)

  const ratio = useMemo(() => {
    const divisor = gcd(width, height) || 1
    return `${width / divisor}:${height / divisor}`
  }, [width, height])

  const scaledHeight = useMemo(() => Math.round((newWidth * height) / width), [newWidth, width, height])

  return (
    <ToolShell title="Image Aspect Ratio Calculator" description="Find a ratio, or scale one dimension to match.">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-white/50">Original width</label>
          <input type="number" min={1} value={width} onChange={(e) => setWidth(Math.max(1, Number(e.target.value) || 1))} className="field mt-1" />
        </div>
        <div>
          <label className="text-xs text-white/50">Original height</label>
          <input type="number" min={1} value={height} onChange={(e) => setHeight(Math.max(1, Number(e.target.value) || 1))} className="field mt-1" />
        </div>
      </div>

      <p className="mt-3 text-sm text-white/70">
        Ratio: <span className="font-display font-semibold text-accent-400">{ratio}</span>
      </p>

      <div className="mt-4 rounded-lg border border-white/10 bg-navy-950 p-3">
        <label className="text-xs text-white/50">Scale to new width</label>
        <input type="number" min={1} value={newWidth} onChange={(e) => setNewWidth(Math.max(1, Number(e.target.value) || 1))} className="field mt-1" />
        <p className="mt-2 text-sm text-white/70">
          New height: <span className="font-semibold text-white">{scaledHeight}px</span>
        </p>
      </div>
    </ToolShell>
  )
}
