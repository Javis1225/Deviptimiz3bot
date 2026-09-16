import { useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

function secureRandomInt(min: number, max: number): number {
  const range = max - min + 1
  const bytes = new Uint32Array(1)
  crypto.getRandomValues(bytes)
  return min + (bytes[0] % range)
}

export default function RandomNumberPicker() {
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [count, setCount] = useState(1)
  const [allowDuplicates, setAllowDuplicates] = useState(true)
  const [results, setResults] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)

  function generate() {
    if (min > max) {
      setError('Min must be less than or equal to max.')
      return
    }
    const rangeSize = max - min + 1
    if (!allowDuplicates && count > rangeSize) {
      setError(`Can't pick ${count} unique numbers from a range of only ${rangeSize}.`)
      return
    }
    setError(null)

    if (allowDuplicates) {
      setResults(Array.from({ length: count }, () => secureRandomInt(min, max)))
    } else {
      const pool = Array.from({ length: rangeSize }, (_, i) => min + i)
      const picked: number[] = []
      for (let i = 0; i < count; i++) {
        const idx = secureRandomInt(0, pool.length - 1)
        picked.push(pool[idx])
        pool.splice(idx, 1)
      }
      setResults(picked)
    }
  }

  return (
    <ToolShell title="Random Number Picker" description="Pick one or more random numbers in a range.">
      <div className="grid grid-cols-3 gap-3">
        <Field label="Min" value={min} onChange={setMin} />
        <Field label="Max" value={max} onChange={setMax} />
        <Field label="How many" value={count} onChange={(v) => setCount(Math.max(1, v))} />
      </div>

      <label className="mt-3 flex items-center gap-2 text-xs text-white/50">
        <input type="checkbox" checked={allowDuplicates} onChange={(e) => setAllowDuplicates(e.target.checked)} />
        Allow duplicates
      </label>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <button type="button" onClick={generate} className="btn-primary mt-3">
        Generate
      </button>

      {results.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {results.map((n, i) => (
            <span key={i} className="rounded-full border border-accent-400/40 bg-accent-400/10 px-3 py-1 font-mono text-sm text-accent-400">
              {n}
            </span>
          ))}
          <CopyButton text={results.join(', ')} />
        </div>
      )}
    </ToolShell>
  )
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <label className="text-xs text-white/50">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} className="field mt-1" />
    </div>
  )
}
