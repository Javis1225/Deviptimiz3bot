import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'

export function countStats(text: string) {
  const trimmed = text.trim()
  const words = trimmed ? trimmed.split(/\s+/).length : 0
  const charsWithSpaces = text.length
  const charsNoSpaces = text.replace(/\s/g, '').length
  const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+|\S+$/g) ?? []).filter((s) => s.trim()).length : 0
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0
  const readingMinutes = words / 200
  const speakingMinutes = words / 130
  return { words, charsWithSpaces, charsNoSpaces, sentences, paragraphs, readingMinutes, speakingMinutes }
}

function formatMinutes(minutes: number): string {
  if (minutes < 1 / 60) return '0 sec'
  if (minutes < 1) return `${Math.max(1, Math.round(minutes * 60))} sec`
  const whole = Math.floor(minutes)
  const seconds = Math.round((minutes - whole) * 60)
  return seconds > 0 ? `${whole} min ${seconds} sec` : `${whole} min`
}

export default function WordCounter() {
  const [text, setText] = useState('')
  const stats = useMemo(() => countStats(text), [text])

  return (
    <ToolShell title="Word Counter & Reading Time Estimator" description="Count words and characters, and estimate reading time.">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="field"
        placeholder="Paste your text here..."
      />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Words" value={stats.words} />
        <Stat label="Characters" value={stats.charsWithSpaces} />
        <Stat label="Characters (no spaces)" value={stats.charsNoSpaces} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
        <Stat label="Reading time" value={formatMinutes(stats.readingMinutes)} />
        <Stat label="Speaking time" value={formatMinutes(stats.speakingMinutes)} />
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
