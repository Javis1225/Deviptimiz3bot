import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

/** Splits any input — including camelCase/PascalCase — into lowercase words. */
export function toWords(input: string): string[] {
  const spaced = input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
  return spaced
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase())
}

export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export const CONVERTERS: { key: string; label: string; convert: (input: string) => string }[] = [
  { key: 'upper', label: 'UPPERCASE', convert: (s) => s.toUpperCase() },
  { key: 'lower', label: 'lowercase', convert: (s) => s.toLowerCase() },
  { key: 'title', label: 'Title Case', convert: (s) => toWords(s).map(capitalize).join(' ') },
  {
    key: 'sentence',
    label: 'Sentence case',
    convert: (s) =>
      s
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s+\w)/g, (m) => m.toUpperCase()),
  },
  {
    key: 'camel',
    label: 'camelCase',
    convert: (s) => {
      const words = toWords(s)
      return words.map((w, i) => (i === 0 ? w : capitalize(w))).join('')
    },
  },
  { key: 'pascal', label: 'PascalCase', convert: (s) => toWords(s).map(capitalize).join('') },
  { key: 'snake', label: 'snake_case', convert: (s) => toWords(s).join('_') },
  { key: 'kebab', label: 'kebab-case', convert: (s) => toWords(s).join('-') },
  { key: 'constant', label: 'CONSTANT_CASE', convert: (s) => toWords(s).join('_').toUpperCase() },
]

export default function CaseConverter() {
  const [input, setInput] = useState('The Quick Brown Fox')

  const results = useMemo(() => CONVERTERS.map((c) => ({ ...c, output: c.convert(input) })), [input])

  return (
    <ToolShell title="Case Converter" description="Convert text between common casing styles.">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
        className="field"
        placeholder="Type or paste text..."
      />

      <div className="mt-4 flex flex-col gap-2">
        {results.map((r) => (
          <div key={r.key} className="flex items-center gap-2 rounded-lg border border-white/10 bg-navy-950 p-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-white/40">{r.label}</p>
              <p className="truncate font-mono text-sm text-white">{r.output || '—'}</p>
            </div>
            <CopyButton text={r.output} />
          </div>
        ))}
      </div>
    </ToolShell>
  )
}
