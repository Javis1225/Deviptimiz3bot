import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

type Mode = 'characters' | 'words' | 'perWord'

function reverseText(input: string, mode: Mode): string {
  if (mode === 'characters') return [...input].reverse().join('')
  if (mode === 'words') return input.split(/(\s+)/).reverse().join('')
  return input
    .split(/(\s+)/)
    .map((token) => (/\s+/.test(token) ? token : [...token].reverse().join('')))
    .join('')
}

export default function ReverseTextGenerator() {
  const [input, setInput] = useState('DevOptimizeBot ships fast')
  const [mode, setMode] = useState<Mode>('characters')

  const output = useMemo(() => reverseText(input, mode), [input, mode])

  return (
    <ToolShell title="Reverse Text Generator" description="Reverse text as a whole string, by word order, or letter by letter within each word.">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} className="field" />

      <div className="mt-3 flex gap-2">
        <ModeButton label="Characters" active={mode === 'characters'} onClick={() => setMode('characters')} />
        <ModeButton label="Word order" active={mode === 'words'} onClick={() => setMode('words')} />
        <ModeButton label="Per word" active={mode === 'perWord'} onClick={() => setMode('perWord')} />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <label className="text-xs font-medium text-white/50">Result</label>
        <CopyButton text={output} />
      </div>
      <textarea value={output} readOnly rows={4} className="field mt-1" />
    </ToolShell>
  )
}

function ModeButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active ? 'border-accent-400 bg-accent-400 text-accent-ink' : 'border-white/15 text-white/70 hover:border-white/30'
      }`}
    >
      {label}
    </button>
  )
}
