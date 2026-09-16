import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

export default function CssGradientGenerator() {
  const [colorA, setColorA] = useState('#182A52')
  const [colorB, setColorB] = useState('#FFC531')
  const [angle, setAngle] = useState(135)
  const [type, setType] = useState<'linear' | 'radial'>('linear')

  const css = useMemo(
    () =>
      type === 'linear'
        ? `linear-gradient(${angle}deg, ${colorA}, ${colorB})`
        : `radial-gradient(circle, ${colorA}, ${colorB})`,
    [type, angle, colorA, colorB],
  )
  const declaration = `background: ${css};`

  return (
    <ToolShell title="CSS Gradient Generator" description="Build a linear or radial gradient and copy the CSS.">
      <div className="h-32 rounded-lg border border-white/10" style={{ background: css }} />

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-xs text-white/50">
          <input type="color" value={colorA} onChange={(e) => setColorA(e.target.value)} className="h-8 w-8 cursor-pointer rounded border border-white/15 bg-transparent" />
          Color A
        </label>
        <label className="flex items-center gap-2 text-xs text-white/50">
          <input type="color" value={colorB} onChange={(e) => setColorB(e.target.value)} className="h-8 w-8 cursor-pointer rounded border border-white/15 bg-transparent" />
          Color B
        </label>
        <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="field w-auto">
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
        </select>
      </div>

      {type === 'linear' && (
        <div className="mt-3">
          <label className="text-xs text-white/50">Angle: {angle}°</label>
          <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-accent-400" />
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-navy-950 p-3">
        <code className="flex-1 break-all font-mono text-sm text-accent-400">{declaration}</code>
        <CopyButton text={declaration} />
      </div>
    </ToolShell>
  )
}
