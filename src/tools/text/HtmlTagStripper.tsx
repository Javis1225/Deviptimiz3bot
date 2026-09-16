import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

function stripHtml(html: string, collapseWhitespace: boolean): string {
  // Parsing offline (not attached to the live document) is safe — nothing executes.
  const doc = new DOMParser().parseFromString(html, 'text/html')
  let text = doc.body.textContent ?? ''
  if (collapseWhitespace) {
    text = text.replace(/[ \t]+/g, ' ').replace(/\n\s*\n\s*/g, '\n\n').trim()
  }
  return text
}

const SAMPLE = `<article>
  <h1>Hello&nbsp;world</h1>
  <p>This is <strong>bold</strong> and <em>italic</em> text.</p>
</article>`

export default function HtmlTagStripper() {
  const [html, setHtml] = useState(SAMPLE)
  const [collapseWhitespace, setCollapseWhitespace] = useState(true)

  const text = useMemo(() => stripHtml(html, collapseWhitespace), [html, collapseWhitespace])

  return (
    <ToolShell title="Stripper of HTML Tags" description="Remove HTML tags and return clean plain text.">
      <textarea value={html} onChange={(e) => setHtml(e.target.value)} rows={8} className="field font-mono text-sm" />

      <label className="mt-3 flex items-center gap-2 text-xs text-white/50">
        <input type="checkbox" checked={collapseWhitespace} onChange={(e) => setCollapseWhitespace(e.target.checked)} />
        Collapse extra whitespace
      </label>

      <div className="mt-3 flex items-center justify-between">
        <label className="text-xs font-medium text-white/50">Plain text</label>
        <CopyButton text={text} />
      </div>
      <textarea value={text} readOnly rows={8} className="field mt-1 text-sm" />
    </ToolShell>
  )
}
