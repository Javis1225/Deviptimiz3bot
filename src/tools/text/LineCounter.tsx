import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'

export default function LineCounter() {
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    const lines = text.length ? text.split('\n') : []
    const nonEmpty = lines.filter((l) => l.trim().length > 0)
    const lengths = lines.map((l) => l.length)
    const longest = lengths.length ? Math.max(...lengths) : 0
    const average = lengths.length ? Math.round((lengths.reduce((a, b) => a + b, 0) / lengths.length) * 10) / 10 : 0
    return {
      total: lines.length,
      nonEmpty: nonEmpty.length,
      empty: lines.length - nonEmpty.length,
      longest,
      average,
    }
  }, [text])

  return (
    <ToolShell title="Line Counter" description="Count total, blank and non-blank lines.">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="field font-mono text-sm"
        placeholder="Paste text here..."
      />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Total lines" value={stats.total} />
        <Stat label="Non-empty" value={stats.nonEmpty} />
        <Stat label="Empty" value={stats.empty} />
        <Stat label="Longest line" value={`${stats.longest} chars`} />
        <Stat label="Average length" value={`${stats.average} chars`} />
      </div>
    </ToolShell>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-navy-950 p-3">
      <p className="text-[11px] text-white/40">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold text-white">{value}</p>
    </div>
  )
}
