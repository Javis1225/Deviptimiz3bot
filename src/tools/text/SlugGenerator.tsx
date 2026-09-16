import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

export function slugify(input: string, separator: string, lowercase: boolean): string {
  let s = input.normalize('NFKD').replace(/[\u0300-\u036f]/g, '') // strip accents
  s = lowercase ? s.toLowerCase() : s
  s = s.replace(/[^a-zA-Z0-9]+/g, separator)
  const escaped = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  s = s.replace(new RegExp(`${escaped}+`, 'g'), separator)
  s = s.replace(new RegExp(`^${escaped}+|${escaped}+$`, 'g'), '')
  return s
}

export default function SlugGenerator() {
  const [input, setInput] = useState('Ship it Friday!')
  const [separator, setSeparator] = useState('-')
  const [lowercase, setLowercase] = useState(true)

  const slug = useMemo(() => slugify(input, separator, lowercase), [input, separator, lowercase])

  return (
    <ToolShell title="Slug Generator" description="Turn any text into a clean, URL-safe slug.">
      <label className="text-xs font-medium text-white/50">Text</label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
        className="field mt-1"
        placeholder="Type or paste a title..."
      />

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs text-white/50">Separator</label>
          <select value={separator} onChange={(e) => setSeparator(e.target.value)} className="field w-auto py-1.5">
            <option value="-">- hyphen</option>
            <option value="_">_ underscore</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-xs text-white/50">
          <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} />
          Lowercase
        </label>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-navy-950 p-3">
        <code className="flex-1 break-all font-mono text-sm text-accent-400">{slug || '—'}</code>
        <CopyButton text={slug} />
      </div>
    </ToolShell>
  )
}
