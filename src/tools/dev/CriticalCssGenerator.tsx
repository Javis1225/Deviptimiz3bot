import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

/** Splits top-level CSS into individual rule blocks, respecting nested braces (media queries etc). */
function splitRules(css: string): string[] {
  const rules: string[] = []
  let depth = 0
  let current = ''
  for (const ch of css) {
    current += ch
    if (ch === '{') depth++
    if (ch === '}') {
      depth--
      if (depth === 0) {
        rules.push(current.trim())
        current = ''
      }
    }
  }
  return rules.filter(Boolean)
}

function matchesAnySelector(rule: string, selectors: string[]): boolean {
  const selectorPart = rule.slice(0, rule.indexOf('{')).trim()
  if (selectorPart.startsWith('@media') || selectorPart.startsWith('@supports')) return true // keep, check inside separately
  const ruleSelectors = selectorPart.split(',').map((s) => s.trim())
  return ruleSelectors.some((rs) => selectors.some((wanted) => rs === wanted || rs.startsWith(wanted)))
}

export function extractCritical(css: string, selectorList: string): string {
  const selectors = selectorList
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (selectors.length === 0) return ''

  return splitRules(css)
    .filter((rule) => matchesAnySelector(rule, selectors))
    .join('\n\n')
}

const SAMPLE_CSS = `.header { background: #182A52; padding: 16px; }
.hero { font-size: 32px; }
.footer { color: #888; padding: 24px; }
.modal { display: none; }`

export default function CriticalCssGenerator() {
  const [css, setCss] = useState(SAMPLE_CSS)
  const [selectors, setSelectors] = useState('.header\n.hero')

  const output = useMemo(() => extractCritical(css, selectors), [css, selectors])

  return (
    <ToolShell
      title="Critical CSS Generator"
      description="Extract rules for the selectors you list — for automatic above-the-fold detection from a live page, a headless browser is really required, which this in-browser tool can't do."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs text-white/50">Full CSS</label>
          <textarea value={css} onChange={(e) => setCss(e.target.value)} rows={8} className="field mt-1 font-mono text-sm" />
        </div>
        <div>
          <label className="text-xs text-white/50">Above-the-fold selectors (one per line)</label>
          <textarea value={selectors} onChange={(e) => setSelectors(e.target.value)} rows={8} className="field mt-1 font-mono text-sm" />
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <CopyButton text={output} />
      </div>
      <textarea value={output} readOnly rows={6} className="field mt-1 font-mono text-sm" placeholder="Matching rules will appear here" />
    </ToolShell>
  )
}
