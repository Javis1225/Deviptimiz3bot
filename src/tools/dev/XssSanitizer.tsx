import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

function htmlEscape(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Stricter pass: also strips script/style tags and inline event-handler
 * attributes, for pasting into contexts that already allow some HTML. */
function stripDangerous(input: string): string {
  const doc = new DOMParser().parseFromString(input, 'text/html')
  doc.querySelectorAll('script, style, iframe, object, embed').forEach((el) => el.remove())
  doc.querySelectorAll('*').forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (/^on/i.test(attr.name) || (attr.name === 'href' && /^javascript:/i.test(attr.value))) {
        el.removeAttribute(attr.name)
      }
    }
  })
  return doc.body.innerHTML
}

export default function XssSanitizer() {
  const [input, setInput] = useState('<img src=x onerror="alert(1)"> Hello <script>alert(\'xss\')</script> & welcome!')
  const [mode, setMode] = useState<'escape' | 'strip'>('escape')

  const output = useMemo(() => (mode === 'escape' ? htmlEscape(input) : stripDangerous(input)), [input, mode])

  return (
    <ToolShell title="XSS Input Sanitizer" description="Escape or strip dangerous HTML from user input, entirely in your browser.">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={5} className="field font-mono text-sm" />

      <div className="mt-3 flex gap-2">
        <ModeButton label="Escape everything" active={mode === 'escape'} onClick={() => setMode('escape')} />
        <ModeButton label="Strip dangerous tags only" active={mode === 'strip'} onClick={() => setMode('strip')} />
      </div>
      <p className="mt-2 text-[11px] text-white/30">
        {mode === 'escape'
          ? 'Turns all HTML into safe visible text — use this when the output should never be rendered as HTML.'
          : 'Removes script/style/iframe tags and inline event handlers, but keeps other HTML — use only when some HTML is genuinely needed.'}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <label className="text-xs font-medium text-white/50">Sanitized output</label>
        <CopyButton text={output} />
      </div>
      <textarea value={output} readOnly rows={5} className="field mt-1 font-mono text-sm" />
    </ToolShell>
  )
}

function ModeButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
        active ? 'border-accent-400 bg-accent-400 text-accent-ink' : 'border-white/15 text-white/70 hover:border-white/30'
      }`}
    >
      {label}
    </button>
  )
}
