import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

type Mode = 'trimLines' | 'collapseSpaces' | 'removeEmptyLines' | 'removeAll'

const MODES: { key: Mode; label: string }[] = [
  { key: 'trimLines', label: 'Trim each line' },
  { key: 'collapseSpaces', label: 'Collapse multiple spaces' },
  { key: 'removeEmptyLines', label: 'Remove empty lines' },
  { key: 'removeAll', label: 'Remove all whitespace' },
]

function applyModes(input: string, active: Set<Mode>): string {
  if (active.has('removeAll')) return input.replace(/\s+/g, '')

  let lines = input.split('\n')
  if (active.has('trimLines')) lines = lines.map((l) => l.trim())
  if (active.has('collapseSpaces')) lines = lines.map((l) => l.replace(/[ \t]+/g, ' '))
  if (active.has('removeEmptyLines')) lines = lines.filter((l) => l.trim() !== '')
  return lines.join('\n')
}

export default function WhitespaceRemover() {
  const [input, setInput] = useState('  Hello   world  \n\n\n  DevOptimizeBot   is   fast  \n')
  const [active, setActive] = useState<Set<Mode>>(new Set(['trimLines', 'collapseSpaces', 'removeEmptyLines']))

  const output = useMemo(() => applyModes(input, active), [input, active])

  function toggle(mode: Mode) {
    setActive((prev) => {
      const next = new Set(prev)
      if (mode === 'removeAll') {
        return next.has('removeAll') ? new Set() : new Set(['removeAll'])
      }
      next.delete('removeAll')
      if (next.has(mode)) next.delete(mode)
      else next.add(mode)
      return next
    })
  }

  return (
    <ToolShell title="Whitespace Remover" description="Trim, collapse or fully remove extra whitespace from text.">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="field font-mono text-sm" />

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/50">
        {MODES.map((m) => (
          <label key={m.key} className="flex items-center gap-2">
            <input type="checkbox" checked={active.has(m.key)} onChange={() => toggle(m.key)} />
            {m.label}
          </label>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <label className="text-xs font-medium text-white/50">Result</label>
        <CopyButton text={output} />
      </div>
      <textarea value={output} readOnly rows={6} className="field mt-1 font-mono text-sm" />
    </ToolShell>
  )
}
