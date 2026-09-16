import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

function nodeToMarkdown(node: ChildNode): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent ?? '').replace(/\s+/g, ' ')
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return ''

  const el = node as HTMLElement
  const children = Array.from(el.childNodes).map(nodeToMarkdown).join('')
  const tag = el.tagName.toLowerCase()

  switch (tag) {
    case 'h1': return `# ${children.trim()}\n\n`
    case 'h2': return `## ${children.trim()}\n\n`
    case 'h3': return `### ${children.trim()}\n\n`
    case 'h4': return `#### ${children.trim()}\n\n`
    case 'strong': case 'b': return `**${children.trim()}**`
    case 'em': case 'i': return `*${children.trim()}*`
    case 'code': return `\`${children.trim()}\``
    case 'pre': return `\`\`\`\n${el.textContent ?? ''}\n\`\`\`\n\n`
    case 'a': return `[${children.trim()}](${el.getAttribute('href') ?? ''})`
    case 'img': return `![${el.getAttribute('alt') ?? ''}](${el.getAttribute('src') ?? ''})`
    case 'br': return '\n'
    case 'hr': return '---\n\n'
    case 'blockquote': return `> ${children.trim()}\n\n`
    case 'li': {
      const parentTag = el.parentElement?.tagName.toLowerCase()
      const prefix = parentTag === 'ol' ? '1.' : '-'
      return `${prefix} ${children.trim()}\n`
    }
    case 'ul': case 'ol': return `${children}\n`
    case 'p': case 'div': return `${children.trim()}\n\n`
    default: return children
  }
}

function htmlToMarkdown(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const markdown = Array.from(doc.body.childNodes).map(nodeToMarkdown).join('')
  return markdown.replace(/\n{3,}/g, '\n\n').trim()
}

const SAMPLE = `<h1>Release notes</h1>
<p>Ship it <strong>Friday</strong> with the <em>new</em> toolbox.</p>
<ul>
  <li>Faster tools</li>
  <li>Cleaner UI</li>
</ul>`

export default function HtmlToMarkdown() {
  const [html, setHtml] = useState(SAMPLE)
  const markdown = useMemo(() => htmlToMarkdown(html), [html])

  return (
    <ToolShell title="HTML to Markdown Converter" description="Converts simple HTML back into Markdown.">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-white/50">HTML</label>
          <textarea value={html} onChange={(e) => setHtml(e.target.value)} rows={12} className="field mt-1 font-mono text-sm" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-white/50">Markdown output</label>
            <CopyButton text={markdown} />
          </div>
          <textarea value={markdown} readOnly rows={12} className="field mt-1 font-mono text-sm" />
        </div>
      </div>
    </ToolShell>
  )
}
