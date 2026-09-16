import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'

export type DiffLine = { type: 'same' | 'added' | 'removed'; text: string }

// Longest-common-subsequence line diff. O(n*m); fine for typical tool-sized inputs.
export function diffLines(a: string, b: string): DiffLine[] {
  const la = a.split('\n')
  const lb = b.split('\n')
  const n = la.length
  const m = lb.length
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = la[i] === lb[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  const result: DiffLine[] = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (la[i] === lb[j]) {
      result.push({ type: 'same', text: la[i] })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: 'removed', text: la[i] })
      i++
    } else {
      result.push({ type: 'added', text: lb[j] })
      j++
    }
  }
  while (i < n) result.push({ type: 'removed', text: la[i++] })
  while (j < m) result.push({ type: 'added', text: lb[j++] })
  return result
}

const MAX_LINES = 2000 // keep the O(n*m) DP comfortably fast in-browser

export default function TextDiffChecker() {
  const [original, setOriginal] = useState('Hello world\nThis is line two\nGoodbye')
  const [changed, setChanged] = useState('Hello world\nThis is line 2\nGoodbye\nAnd one more line')

  const tooLarge = original.split('\n').length > MAX_LINES || changed.split('\n').length > MAX_LINES
  const diff = useMemo(() => (tooLarge ? [] : diffLines(original, changed)), [original, changed, tooLarge])
  const added = diff.filter((d) => d.type === 'added').length
  const removed = diff.filter((d) => d.type === 'removed').length

  return (
    <ToolShell title="Text Diff Checker" description="Compare two blocks of text line by line.">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-white/50">Original</label>
          <textarea value={original} onChange={(e) => setOriginal(e.target.value)} rows={6} className="field mt-1 font-mono text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-white/50">Changed</label>
          <textarea value={changed} onChange={(e) => setChanged(e.target.value)} rows={6} className="field mt-1 font-mono text-sm" />
        </div>
      </div>

      {tooLarge ? (
        <p className="mt-4 text-sm text-white/50">That's a lot of lines for an in-browser diff — try a smaller excerpt.</p>
      ) : (
        <>
          <p className="mt-4 text-xs text-white/40">
            <span className="text-emerald-400">+{added} added</span> · <span className="text-red-400">-{removed} removed</span>
          </p>
          <div className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-navy-950 font-mono text-xs">
            {diff.map((line, idx) => (
              <div
                key={idx}
                className={`whitespace-pre px-3 py-0.5 ${
                  line.type === 'added'
                    ? 'bg-emerald-500/10 text-emerald-300'
                    : line.type === 'removed'
                      ? 'bg-red-500/10 text-red-300'
                      : 'text-white/60'
                }`}
              >
                {line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  '}
                {line.text || ' '}
              </div>
            ))}
          </div>
        </>
      )}
    </ToolShell>
  )
}
