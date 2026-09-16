import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default function FindAndReplace() {
  const [input, setInput] = useState('')
  const [find, setFind] = useState('')
  const [replace, setReplace] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(true)
  const [wholeWord, setWholeWord] = useState(false)
  const [useRegex, setUseRegex] = useState(false)
  const [regexError, setRegexError] = useState<string | null>(null)

  const { output, matchCount } = useMemo(() => {
    if (!find) return { output: input, matchCount: 0 }
    setRegexError(null)
    try {
      const pattern = useRegex ? find : escapeRegExp(find)
      const bounded = wholeWord ? `\\b(?:${pattern})\\b` : pattern
      const flags = caseSensitive ? 'g' : 'gi'
      const re = new RegExp(bounded, flags)
      const matches = input.match(re)
      return { output: input.replace(re, replace), matchCount: matches?.length ?? 0 }
    } catch (err) {
      setRegexError(err instanceof Error ? err.message : 'Invalid pattern')
      return { output: input, matchCount: 0 }
    }
  }, [input, find, replace, caseSensitive, wholeWord, useRegex])

  return (
    <ToolShell title="Find and Replace Tool" description="Find and replace text, with optional regex support.">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={7}
        className="field font-mono text-sm"
        placeholder="Paste text here..."
      />

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <input value={find} onChange={(e) => setFind(e.target.value)} placeholder="Find..." className="field" />
        <input value={replace} onChange={(e) => setReplace(e.target.value)} placeholder="Replace with..." className="field" />
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/50">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} />
          Case-sensitive
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={wholeWord} onChange={(e) => setWholeWord(e.target.checked)} />
          Whole word
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} />
          Regex
        </label>
      </div>

      {regexError && <p className="mt-2 text-xs text-red-400">Invalid pattern: {regexError}</p>}

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-white/40">{matchCount} match{matchCount === 1 ? '' : 'es'}</p>
        <CopyButton text={output} />
      </div>
      <textarea value={output} readOnly rows={7} className="field mt-2 font-mono text-sm" />
    </ToolShell>
  )
}
