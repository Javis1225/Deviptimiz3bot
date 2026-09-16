import { useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

export default function CssBorderRadiusGenerator() {
  const [tl, setTl] = useState(24)
  const [tr, setTr] = useState(24)
  const [br, setBr] = useState(24)
  const [bl, setBl] = useState(24)
  const [linked, setLinked] = useState(true)

  function updateCorner(setter: (n: number) => void, value: number) {
    if (linked) {
      setTl(value)
      setTr(value)
      setBr(value)
      setBl(value)
    } else {
      setter(value)
    }
  }

  const radius = `${tl}px ${tr}px ${br}px ${bl}px`
  const declaration = `border-radius: ${radius};`

  return (
    <ToolShell title="CSS Border Radius Generator" description="Build a border-radius value with a live preview.">
      <div className="flex h-32 items-center justify-center rounded-lg bg-white/5">
        <div className="h-20 w-32 border-2 border-accent-400 bg-navy-800" style={{ borderRadius: radius }} />
      </div>

      <label className="mt-4 flex items-center gap-2 text-xs text-white/50">
        <input type="checkbox" checked={linked} onChange={(e) => setLinked(e.target.checked)} />
        Link all corners
      </label>

      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Corner label="Top left" value={tl} onChange={(v) => updateCorner(setTl, v)} />
        <Corner label="Top right" value={tr} onChange={(v) => updateCorner(setTr, v)} />
        <Corner label="Bottom right" value={br} onChange={(v) => updateCorner(setBr, v)} />
        <Corner label="Bottom left" value={bl} onChange={(v) => updateCorner(setBl, v)} />
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-navy-950 p-3">
        <code className="flex-1 break-all font-mono text-sm text-accent-400">{declaration}</code>
        <CopyButton text={declaration} />
      </div>
    </ToolShell>
  )
}

function Corner({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <label className="text-xs text-white/50">{label}</label>
      <input type="number" min={0} max={200} value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} className="field mt-1" />
    </div>
  )
}
