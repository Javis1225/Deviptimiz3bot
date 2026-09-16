import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'

export default function RegexTester() {
  const [pattern, setPattern] = useState('(\\w+)@(\\w+\\.\\w+)')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('Contact us at hello@devoptimizebot.app or support@example.com')

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [], error: null as string | null }
    try {
      const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')
      return { matches: [...testString.matchAll(re)], error: null }
    } catch (err) {
      return { matches: [], error: err instanceof Error ? err.message : 'Invalid regex' }
    }
  }, [pattern, flags, testString])

  const highlighted = useMemo(() => {
    if (error || matches.length === 0) return null
    const parts: { text: string; matched: boolean }[] = []
    let lastIndex = 0
    for (const m of matches) {
      if (m.index === undefined) continue
      if (m.index > lastIndex) parts.push({ text: testString.slice(lastIndex, m.index), matched: false })
      parts.push({ text: m[0], matched: true })
      lastIndex = m.index + m[0].length
    }
    parts.push({ text: testString.slice(lastIndex), matched: false })
    return parts
  }, [matches, testString, error])

  return (
    <ToolShell title="Regex Tester" description="Test a regular expression against sample text.">
      <div className="flex items-center gap-2 font-mono text-sm">
        <span className="text-white/40">/</span>
        <input value={pattern} onChange={(e) => setPattern(e.target.value)} className="field flex-1" />
        <span className="text-white/40">/</span>
        <input value={flags} onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ''))} className="field w-16" />
      </div>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      <textarea value={testString} onChange={(e) => setTestString(e.target.value)} rows={4} className="field mt-3 font-mono text-sm" />

      {highlighted && (
        <div className="mt-3 rounded-lg border border-white/10 bg-navy-950 p-3 font-mono text-sm leading-relaxed">
          {highlighted.map((part, i) =>
            part.matched ? (
              <mark key={i} className="rounded bg-accent-400/30 px-0.5 text-accent-300">
                {part.text}
              </mark>
            ) : (
              <span key={i} className="text-white/70">
                {part.text}
              </span>
            ),
          )}
        </div>
      )}

      <p className="mt-3 text-xs text-white/40">
        {matches.length} match{matches.length === 1 ? '' : 'es'}
      </p>
      {matches.length > 0 && matches.some((m) => m.length > 1) && (
        <div className="mt-1 flex flex-col gap-1 text-xs text-white/50">
          {matches.map((m, i) => (
            <p key={i} className="font-mono">
              Match {i + 1}: {m.slice(1).map((g, gi) => `$${gi + 1}=${g ?? ''}`).join(' ')}
            </p>
          ))}
        </div>
      )}
    </ToolShell>
  )
}
