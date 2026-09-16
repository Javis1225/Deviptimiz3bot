import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inline(s: string): string {
  let out = escapeHtml(s)
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>')
  out = out.replace(/\*\*([^*]+)\*\*|__([^_]+)__/g, (_, a, b) => `<strong>${a ?? b}</strong>`)
  out = out.replace(/\*([^*]+)\*|_([^_]+)_/g, (_, a, b) => `<em>${a ?? b}</em>`)
  out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  return out
}

/** Handles headings, bold/italic/code, links/images, lists, blockquotes, code
 * fences, horizontal rules, and paragraphs — a practical subset, not a full
 * CommonMark implementation. */
function markdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const html: string[] = []
  let i = 0
  let listType: 'ul' | 'ol' | null = null

  function closeList() {
    if (listType) {
      html.push(`</${listType}>`)
      listType = null
    }
  }

  while (i < lines.length) {
    const line = lines[i]

    if (/^```/.test(line)) {
      const code: string[] = []
      i++
      while (i < lines.length && !/^```/.test(lines[i])) {
        code.push(lines[i])
        i++
      }
      closeList()
      html.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`)
      i++
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      closeList()
      const level = heading[1].length
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`)
      i++
      continue
    }

    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      closeList()
      html.push('<hr />')
      i++
      continue
    }

    if (/^>\s?/.test(line)) {
      closeList()
      const quoteLines: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      html.push(`<blockquote><p>${inline(quoteLines.join(' '))}</p></blockquote>`)
      continue
    }

    const ordered = line.match(/^\s*\d+\.\s+(.*)$/)
    const unordered = line.match(/^\s*[-*+]\s+(.*)$/)
    if (ordered || unordered) {
      const wantType = ordered ? 'ol' : 'ul'
      if (listType !== wantType) {
        closeList()
        html.push(`<${wantType}>`)
        listType = wantType
      }
      html.push(`<li>${inline((ordered ?? unordered)![1])}</li>`)
      i++
      continue
    }

    closeList()
    if (line.trim() === '') {
      i++
      continue
    }
    html.push(`<p>${inline(line)}</p>`)
    i++
  }
  closeList()
  return html.join('\n')
}

const SAMPLE = `# Release notes

Ship it **Friday** with the *new* toolbox.

- Faster tools
- Cleaner UI
- More coming soon

> Built with DevOptimizeBot.`

export default function MarkdownToHtml() {
  const [markdown, setMarkdown] = useState(SAMPLE)
  const html = useMemo(() => markdownToHtml(markdown), [markdown])

  return (
    <ToolShell title="Markdown to HTML Converter" description="Converts common Markdown syntax to clean HTML.">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-white/50">Markdown</label>
          <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} rows={12} className="field mt-1 font-mono text-sm" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-white/50">HTML output</label>
            <CopyButton text={html} />
          </div>
          <textarea value={html} readOnly rows={12} className="field mt-1 font-mono text-sm" />
        </div>
      </div>
    </ToolShell>
  )
}
