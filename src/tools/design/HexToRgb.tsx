import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.trim().replace(/^#/, '')
  const expanded = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return null
  return {
    r: parseInt(expanded.slice(0, 2), 16),
    g: parseInt(expanded.slice(2, 4), 16),
    b: parseInt(expanded.slice(4, 6), 16),
  }
}

export default function HexToRgb() {
  const [hex, setHex] = useState('#FFC531')
  const rgb = useMemo(() => parseHex(hex), [hex])
  const output = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : ''

  return (
    <ToolShell title="HEX to RGB Converter" description="Convert a HEX color code to RGB.">
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={rgb ? hex.startsWith('#') ? hex : `#${hex}` : '#000000'}
          onChange={(e) => setHex(e.target.value)}
          className="h-10 w-10 shrink-0 cursor-pointer rounded border border-white/15 bg-transparent"
        />
        <input value={hex} onChange={(e) => setHex(e.target.value)} placeholder="#FFC531" className="field font-mono" />
      </div>

      {!rgb ? (
        <p className="mt-3 text-sm text-red-400">Enter a valid 3 or 6-digit hex code.</p>
      ) : (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-navy-950 p-3">
          <code className="flex-1 font-mono text-sm text-accent-400">{output}</code>
          <CopyButton text={output} />
        </div>
      )}
    </ToolShell>
  )
}
