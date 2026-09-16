import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  const l = (max + min) / 2
  const d = max - min
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h, s, l }
}

export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let [r, g, b] = [0, 0, 0]
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

function buildPalette(hex: string, offsets: number[]): string[] {
  const { h, s, l } = hexToHsl(hex)
  return offsets.map((offset) => hslToHex(h + offset, s, l))
}

const SCHEMES = {
  complementary: [0, 180],
  analogous: [-30, 0, 30],
  triadic: [0, 120, 240],
  monochromatic: [0, 0, 0, 0],
}

export default function ColorPaletteGenerator() {
  const [base, setBase] = useState('#FFC531')
  const [scheme, setScheme] = useState<keyof typeof SCHEMES>('analogous')

  const palette = useMemo(() => {
    if (scheme !== 'monochromatic') return buildPalette(base, SCHEMES[scheme])
    const { h, s } = hexToHsl(base)
    return [0.25, 0.4, 0.55, 0.7].map((l) => hslToHex(h, s, l))
  }, [base, scheme])

  return (
    <ToolShell title="Color Palette Generator" description="Generate a palette from a base color.">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="color"
          value={base}
          onChange={(e) => setBase(e.target.value)}
          className="h-10 w-10 cursor-pointer rounded border border-white/15 bg-transparent"
        />
        <input value={base} onChange={(e) => setBase(e.target.value)} className="field w-32 font-mono" />
        <select value={scheme} onChange={(e) => setScheme(e.target.value as keyof typeof SCHEMES)} className="field w-auto">
          <option value="complementary">Complementary</option>
          <option value="analogous">Analogous</option>
          <option value="triadic">Triadic</option>
          <option value="monochromatic">Monochromatic</option>
        </select>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {palette.map((color) => (
          <div key={color} className="overflow-hidden rounded-lg border border-white/10">
            <div className="h-16" style={{ backgroundColor: color }} />
            <div className="flex items-center justify-between bg-navy-950 px-2 py-1.5">
              <code className="text-[11px] text-white/70">{color}</code>
              <CopyButton text={color} label="" />
            </div>
          </div>
        ))}
      </div>
    </ToolShell>
  )
}
