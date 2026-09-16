import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'

export function relativeLuminance(hex: string): number {
  const clean = hex.replace('#', '')
  const channel = (v: number) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  const r = channel(parseInt(clean.slice(0, 2), 16))
  const g = channel(parseInt(clean.slice(2, 4), 16))
  const b = channel(parseInt(clean.slice(4, 6), 16))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(hexA: string, hexB: string): number {
  const l1 = relativeLuminance(hexA)
  const l2 = relativeLuminance(hexB)
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (lighter + 0.05) / (darker + 0.05)
}

function Badge({ pass, label }: { pass: boolean; label: string }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[11px] ${
        pass ? 'border-emerald-400/40 text-emerald-300' : 'border-red-400/40 text-red-300'
      }`}
    >
      {label} {pass ? 'Pass' : 'Fail'}
    </span>
  )
}

export default function ColorContrastChecker() {
  const [foreground, setForeground] = useState('#FFFFFF')
  const [background, setBackground] = useState('#182A52')

  const ratio = useMemo(() => contrastRatio(foreground, background), [foreground, background])

  return (
    <ToolShell title="Color Contrast Checker" description="Check WCAG contrast between two colors.">
      <div className="grid gap-3 sm:grid-cols-2">
        <ColorField label="Text color" value={foreground} onChange={setForeground} />
        <ColorField label="Background color" value={background} onChange={setBackground} />
      </div>

      <div
        className="mt-4 flex h-24 items-center justify-center rounded-lg border border-white/10 text-lg font-semibold"
        style={{ backgroundColor: background, color: foreground }}
      >
        Sample text
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <p className="font-display text-2xl font-semibold text-white">{ratio.toFixed(2)}:1</p>
        <Badge pass={ratio >= 4.5} label="AA normal text" />
        <Badge pass={ratio >= 3} label="AA large text" />
        <Badge pass={ratio >= 7} label="AAA normal text" />
      </div>
    </ToolShell>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-white/50">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-9 cursor-pointer rounded border border-white/15 bg-transparent" />
        <input value={value} onChange={(e) => onChange(e.target.value)} className="field font-mono" />
      </div>
    </div>
  )
}
