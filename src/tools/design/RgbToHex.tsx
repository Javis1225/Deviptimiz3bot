import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

function toHex(n: number): string {
  return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
}

export default function RgbToHex() {
  const [r, setR] = useState(255)
  const [g, setG] = useState(197)
  const [b, setB] = useState(49)

  const hex = useMemo(() => `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase(), [r, g, b])

  return (
    <ToolShell title="RGB to HEX Converter" description="Convert RGB values to a HEX color code.">
      <div className="grid grid-cols-3 gap-3">
        <NumberField label="R" value={r} onChange={setR} />
        <NumberField label="G" value={g} onChange={setG} />
        <NumberField label="B" value={b} onChange={setB} />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded border border-white/15" style={{ backgroundColor: hex }} />
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-navy-950 p-3">
          <code className="flex-1 font-mono text-sm text-accent-400">{hex}</code>
          <CopyButton text={hex} />
        </div>
      </div>
    </ToolShell>
  )
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <label className="text-xs text-white/50">{label}</label>
      <input
        type="number"
        min={0}
        max={255}
        value={value}
        onChange={(e) => onChange(Math.max(0, Math.min(255, Number(e.target.value) || 0)))}
        className="field mt-1"
      />
    </div>
  )
}
