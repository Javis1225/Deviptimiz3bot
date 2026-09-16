import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

export function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // comments
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>~+])\s*/g, '$1')
    .replace(/;}/g, '}')
    .replace(/\s*!important/g, '!important')
    .trim()
}

const SAMPLE = `.card {
  background: #182A52;
  border-radius: 12px;
  padding: 16px 20px;
}

.card:hover {
  border-color: #FFC531;
}`

export default function CssMinifier() {
  const [input, setInput] = useState(SAMPLE)
  const output = useMemo(() => minifyCss(input), [input])
  const savings = input.length ? Math.round((1 - output.length / input.length) * 100) : 0

  return (
    <ToolShell title="CSS Minifier" description="Strip comments and collapse whitespace in a CSS file.">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="field font-mono text-sm" />

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-white/40">
          {input.length} → {output.length} chars ({savings}% smaller)
        </p>
        <CopyButton text={output} />
      </div>
      <textarea value={output} readOnly rows={4} className="field mt-1 font-mono text-sm" />
    </ToolShell>
  )
}
