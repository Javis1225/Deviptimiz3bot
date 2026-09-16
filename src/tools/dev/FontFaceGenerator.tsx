import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

const FORMATS: { ext: string; format: string }[] = [
  { ext: 'woff2', format: 'woff2' },
  { ext: 'woff', format: 'woff' },
]

export default function FontFaceGenerator() {
  const [family, setFamily] = useState('Inter')
  const [basePath, setBasePath] = useState('/fonts/inter')
  const [weight, setWeight] = useState(400)
  const [style, setStyle] = useState<'normal' | 'italic'>('normal')
  const [display, setDisplay] = useState<'swap' | 'auto' | 'block' | 'fallback' | 'optional'>('swap')

  const css = useMemo(() => {
    const sources = FORMATS.map((f) => `url('${basePath}.${f.ext}') format('${f.format}')`).join(',\n    ')
    return `@font-face {
  font-family: '${family}';
  src:
    ${sources};
  font-weight: ${weight};
  font-style: ${style};
  font-display: ${display};
}`
  }, [family, basePath, weight, style, display])

  return (
    <ToolShell title="@font-face CSS Generator" description="Build an @font-face declaration for a self-hosted font.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Font family name" value={family} onChange={setFamily} />
        <Field label="Base file path (no extension)" value={basePath} onChange={setBasePath} />
        <div>
          <label className="text-xs text-white/50">Weight</label>
          <input type="number" min={100} max={900} step={100} value={weight} onChange={(e) => setWeight(Number(e.target.value) || 400)} className="field mt-1" />
        </div>
        <div>
          <label className="text-xs text-white/50">Style</label>
          <select value={style} onChange={(e) => setStyle(e.target.value as typeof style)} className="field mt-1">
            <option value="normal">Normal</option>
            <option value="italic">Italic</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-white/50">font-display</label>
          <select value={display} onChange={(e) => setDisplay(e.target.value as typeof display)} className="field mt-1">
            {['swap', 'auto', 'block', 'fallback', 'optional'].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <CopyButton text={css} />
      </div>
      <pre className="field mt-1 overflow-x-auto whitespace-pre font-mono text-xs">{css}</pre>
    </ToolShell>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-white/50">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="field mt-1" />
    </div>
  )
}
