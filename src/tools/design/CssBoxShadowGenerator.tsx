import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

export default function CssBoxShadowGenerator() {
  const [x, setX] = useState(0)
  const [y, setY] = useState(10)
  const [blur, setBlur] = useState(24)
  const [spread, setSpread] = useState(-4)
  const [color, setColor] = useState('#000000')
  const [opacity, setOpacity] = useState(45)
  const [inset, setInset] = useState(false)

  const rgba = useMemo(() => {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`
  }, [color, opacity])

  const shadow = `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${rgba}`
  const declaration = `box-shadow: ${shadow};`

  return (
    <ToolShell title="CSS Box Shadow Generator" description="Build a box-shadow value with a live preview.">
      <div className="flex h-32 items-center justify-center rounded-lg bg-white/5">
        <div className="h-16 w-24 rounded-lg bg-navy-800" style={{ boxShadow: shadow }} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Slider label={`Offset X: ${x}px`} value={x} min={-50} max={50} onChange={setX} />
        <Slider label={`Offset Y: ${y}px`} value={y} min={-50} max={50} onChange={setY} />
        <Slider label={`Blur: ${blur}px`} value={blur} min={0} max={100} onChange={setBlur} />
        <Slider label={`Spread: ${spread}px`} value={spread} min={-50} max={50} onChange={setSpread} />
        <Slider label={`Opacity: ${opacity}%`} value={opacity} min={0} max={100} onChange={setOpacity} />
        <div className="flex items-center gap-3">
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-9 cursor-pointer rounded border border-white/15 bg-transparent" />
          <label className="flex items-center gap-2 text-xs text-white/50">
            <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} />
            Inset
          </label>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-navy-950 p-3">
        <code className="flex-1 break-all font-mono text-sm text-accent-400">{declaration}</code>
        <CopyButton text={declaration} />
      </div>
    </ToolShell>
  )
}

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div>
      <label className="text-xs text-white/50">{label}</label>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-accent-400" />
    </div>
  )
}
