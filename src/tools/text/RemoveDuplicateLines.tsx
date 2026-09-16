import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

export default function RemoveDuplicateLines() {
  const [input, setInput] = useState('')
  const [caseInsensitive, setCaseInsensitive] = useState(false)
  const [trimLines, setTrimLines] = useState(true)

  const { output, removedCount } = useMemo(() => {
    const lines = input.split('\n')
    const seen = new Set<string>()
    const kept: string[] = []
    for (const rawLine of lines) {
      const line = trimLines ? rawLine.trim() : rawLine
      const key = caseInsensitive ? line.toLowerCase() : line
      if (!seen.has(key)) {
        seen.add(key)
        kept.push(line)
      }
    }
    return { output: kept.join('\n'), removedCount: lines.length - kept.length }
  }, [input, caseInsensitive, trimLines])

  return (
    <ToolShell title="Remove Duplicate Lines" description="Keep the first occurrence of each line, drop the rest.">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={8}
        className="field font-mono text-sm"
        placeholder="Paste lines, one per row..."
      />

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/50">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={caseInsensitive} onChange={(e) => setCaseInsensitive(e.target.checked)} />
          Case-insensitive
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={trimLines} onChange={(e) => setTrimLines(e.target.checked)} />
          Trim whitespace
        </label>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-white/40">Removed {removedCount} duplicate line{removedCount === 1 ? '' : 's'}</p>
        <CopyButton text={output} />
      </div>
      <textarea value={output} readOnly rows={8} className="field mt-2 font-mono text-sm" />
    </ToolShell>
  )
}
