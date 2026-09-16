import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'to', 'of', 'in', 'on',
  'for', 'with', 'as', 'at', 'by', 'it', 'this', 'that', 'be', 'from',
])

export default function WordFrequencyCounter() {
  const [text, setText] = useState('')
  const [excludeStopWords, setExcludeStopWords] = useState(false)

  const frequencies = useMemo(() => {
    const words = (text.toLowerCase().match(/[a-z0-9']+/g) ?? []).filter(
      (w) => !excludeStopWords || !STOP_WORDS.has(w),
    )
    const counts = new Map<string, number>()
    for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 50)
  }, [text, excludeStopWords])

  const maxCount = frequencies[0]?.[1] ?? 1

  return (
    <ToolShell title="Word Frequency Counter" description="See how often each word appears in a block of text.">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="field"
        placeholder="Paste text here..."
      />

      <label className="mt-3 flex items-center gap-2 text-xs text-white/50">
        <input type="checkbox" checked={excludeStopWords} onChange={(e) => setExcludeStopWords(e.target.checked)} />
        Exclude common words (the, a, is...)
      </label>

      {frequencies.length === 0 ? (
        <p className="mt-4 text-sm text-white/40">Nothing to count yet.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-1.5">
          {frequencies.map(([word, count]) => (
            <div key={word} className="flex items-center gap-2 text-xs">
              <span className="w-24 shrink-0 truncate text-white/70">{word}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                <div className="h-full rounded-full bg-accent-400" style={{ width: `${(count / maxCount) * 100}%` }} />
              </div>
              <span className="w-6 shrink-0 text-right text-white/40">{count}</span>
            </div>
          ))}
        </div>
      )}
    </ToolShell>
  )
}
