import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

const URL_PATTERN = /https?:\/\/[^\s"'<>)]+/gi

function extractLinks(input: string): string[] {
  const found = new Set<string>()

  // If it looks like HTML, pull href/src attributes too (DOMParser is safe
  // to use offline like this — nothing executes).
  if (/<[a-z][\s\S]*>/i.test(input)) {
    const doc = new DOMParser().parseFromString(input, 'text/html')
    doc.querySelectorAll('[href]').forEach((el) => found.add(el.getAttribute('href') || ''))
    doc.querySelectorAll('[src]').forEach((el) => found.add(el.getAttribute('src') || ''))
  }

  for (const match of input.match(URL_PATTERN) ?? []) found.add(match.replace(/[.,;]+$/, ''))

  return [...found].filter(Boolean).sort()
}

const SAMPLE = `<p>Check out <a href="https://devoptimizebot.app">our homepage</a> and the
<a href="/docs">docs</a>, or read more at https://example.com/blog/post.</p>`

export default function LinkExtractor() {
  const [input, setInput] = useState(SAMPLE)
  const links = useMemo(() => extractLinks(input), [input])

  return (
    <ToolShell title="Link Extraction Tool" description="Paste HTML or plain text to pull out every link.">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={7} className="field font-mono text-sm" />

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-white/40">
          {links.length} link{links.length === 1 ? '' : 's'} found
        </p>
        {links.length > 0 && <CopyButton text={links.join('\n')} />}
      </div>

      {links.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1 rounded-lg border border-white/10 bg-navy-950 p-3">
          {links.map((link) => (
            <li key={link} className="truncate font-mono text-xs text-accent-400">
              {link}
            </li>
          ))}
        </ul>
      )}
    </ToolShell>
  )
}
