import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

type SortMode = 'alpha' | 'numeric' | 'length'

export default function TextSorter() {
  const [input, setInput] = useState('banana\napple\nfig\ncherry')
  const [mode, setMode] = useState<SortMode>('alpha')
  const [descending, setDescending] = useState(false)
  const [caseInsensitive, setCaseInsensitive] = useState(true)
  const [dropEmpty, setDropEmpty] = useState(true)

  const output = useMemo(() => {
    let lines = input.split('\n')
    if (dropEmpty) lines = lines.filter((l) => l.trim() !== '')

    const compare = (a: string, b: string): number => {
      if (mode === 'numeric') return (parseFloat(a) || 0) - (parseFloat(b) || 0)
      if (mode === 'length') return a.length - b.length
      const av = caseInsensitive ? a.toLowerCase() : a
      const bv = caseInsensitive ? b.toLowerCase() : b
      return av < bv ? -1 : av > bv ? 1 : 0
    }

    const sorted = [...lines].sort(compare)
    if (descending) sorted.reverse()
    return sorted.join('\n')
  }, [input, mode, descending, caseInsensitive, dropEmpty])

  return (
    <ToolShell title="Text Sorter" description="Sort lines alphabetically, numerically, or by length.">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={8}
        className="field font-mono text-sm"
        placeholder="One item per line..."
      />

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <select value={mode} onChange={(e) => setMode(e.target.value as SortMode)} className="field w-auto">
          <option value="alpha">Alphabetical</option>
          <option value="numeric">Numeric</option>
          <option value="length">By length</option>
        </select>
        <label className="flex items-center gap-2 text-xs text-white/50">
          <input type="checkbox" checked={descending} onChange={(e) => setDescending(e.target.checked)} />
          Descending
        </label>
        <label className="flex items-center gap-2 text-xs text-white/50">
          <input type="checkbox" checked={caseInsensitive} onChange={(e) => setCaseInsensitive(e.target.checked)} />
          Case-insensitive
        </label>
        <label className="flex items-center gap-2 text-xs text-white/50">
          <input type="checkbox" checked={dropEmpty} onChange={(e) => setDropEmpty(e.target.checked)} />
          Drop empty lines
        </label>
      </div>

      <div className="mt-3 flex justify-end">
        <CopyButton text={output} />
      </div>
      <textarea value={output} readOnly rows={8} className="field mt-2 font-mono text-sm" />
    </ToolShell>
  )
}
