import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

const PRESERVE_TAGS = /<(pre|script|style|textarea)[\s\S]*?<\/\1>/gi

export function minifyHtml(html: string): string {
  const preserved: string[] = []
  // Protect whitespace-sensitive blocks with placeholders first.
  let working = html.replace(PRESERVE_TAGS, (match) => {
    preserved.push(match)
    return `\u0000${preserved.length - 1}\u0000`
  })

  working = working
    .replace(/<!--[\s\S]*?-->/g, '') // comments
    .replace(/>\s+</g, '><') // whitespace between tags
    .replace(/[ \t]{2,}/g, ' ') // repeated spaces/tabs
    .replace(/\n\s*/g, '') // newlines and leading indentation
    .trim()

  return working.replace(/\u0000(\d+)\u0000/g, (_, idx) => preserved[Number(idx)])
}

const SAMPLE = `<div class="card">
  <h2>Hello</h2>
  <p>
    This is a   paragraph.
  </p>
  <pre>  keep   this   spacing  </pre>
</div>`

export default function HtmlMinifier() {
  const [input, setInput] = useState(SAMPLE)
  const output = useMemo(() => minifyHtml(input), [input])
  const savings = input.length ? Math.round((1 - output.length / input.length) * 100) : 0

  return (
    <ToolShell title="HTML Minifier" description="Collapse whitespace and strip comments — content inside pre/script/style/textarea is left untouched.">
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
