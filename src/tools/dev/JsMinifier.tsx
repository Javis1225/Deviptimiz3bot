import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

/**
 * A basic minifier: strips comments and collapses insignificant whitespace
 * while tracking string/template-literal/regex boundaries so it doesn't
 * mangle content inside them. This is NOT a full parser (no AST, no
 * variable renaming, no dead-code elimination) — for production bundles,
 * a real minifier (esbuild, Terser) is still the right tool.
 */
export function minifyJs(source: string): string {
  let out = ''
  let i = 0
  const n = source.length
  let lastMeaningful = ''

  while (i < n) {
    const ch = source[i]
    const next = source[i + 1]

    // Line comment
    if (ch === '/' && next === '/') {
      while (i < n && source[i] !== '\n') i++
      continue
    }
    // Block comment
    if (ch === '/' && next === '*') {
      i += 2
      while (i < n && !(source[i] === '*' && source[i + 1] === '/')) i++
      i += 2
      continue
    }
    // String literals
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch
      let str = ch
      i++
      while (i < n && source[i] !== quote) {
        if (source[i] === '\\') {
          str += source[i] + (source[i + 1] ?? '')
          i += 2
          continue
        }
        str += source[i]
        i++
      }
      str += quote
      i++
      out += str
      lastMeaningful = str
      continue
    }
    // Regex literal (heuristic: '/' not preceded by an identifier/number/closing bracket)
    if (ch === '/' && !/[\w$)\]]$/.test(lastMeaningful)) {
      let j = i + 1
      let inClass = false
      while (j < n && (inClass || source[j] !== '/')) {
        if (source[j] === '\\') j++
        else if (source[j] === '[') inClass = true
        else if (source[j] === ']') inClass = false
        j++
      }
      if (j < n) {
        j++ // consume closing slash
        while (j < n && /[a-z]/i.test(source[j])) j++ // flags
        const regex = source.slice(i, j)
        out += regex
        lastMeaningful = regex
        i = j
        continue
      }
    }
    // Whitespace collapsing
    if (/\s/.test(ch)) {
      let j = i
      let hasNewline = false
      while (j < n && /\s/.test(source[j])) {
        if (source[j] === '\n') hasNewline = true
        j++
      }
      const needsSpace = /[\w$]$/.test(lastMeaningful) && /^[\w$]/.test(source[j] ?? '')
      out += needsSpace ? ' ' : hasNewline && /[)}\]\w$'"`]$/.test(lastMeaningful) ? '\n' : ''
      i = j
      continue
    }

    out += ch
    lastMeaningful += ch
    if (lastMeaningful.length > 2) lastMeaningful = lastMeaningful.slice(-2)
    i++
  }

  return out.trim()
}

const SAMPLE = `// Sum an array of numbers
function sum(numbers) {
  let total = 0;
  for (const n of numbers) {
    total += n; // running total
  }
  return total;
}`

export default function JsMinifier() {
  const [input, setInput] = useState(SAMPLE)
  const output = useMemo(() => minifyJs(input), [input])
  const savings = input.length ? Math.round((1 - output.length / input.length) * 100) : 0

  return (
    <ToolShell title="JavaScript Minifier" description="Strips comments and extra whitespace. Basic — not a substitute for a real bundler minifier on production code.">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={9} className="field font-mono text-sm" />

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-white/40">
          {input.length} → {output.length} chars ({savings}% smaller)
        </p>
        <CopyButton text={output} />
      </div>
      <textarea value={output} readOnly rows={6} className="field mt-1 font-mono text-sm" />
    </ToolShell>
  )
}
