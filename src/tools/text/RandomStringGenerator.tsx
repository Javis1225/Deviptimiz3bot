import { useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

const CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}',
}

function generate(length: number, options: Record<keyof typeof CHARSETS, boolean>): string {
  const pool = (Object.keys(CHARSETS) as (keyof typeof CHARSETS)[])
    .filter((key) => options[key])
    .map((key) => CHARSETS[key])
    .join('')
  if (!pool) return ''

  const bytes = new Uint32Array(length)
  crypto.getRandomValues(bytes)
  let result = ''
  for (let i = 0; i < length; i++) {
    result += pool[bytes[i] % pool.length]
  }
  return result
}

export default function RandomStringGenerator() {
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: false })
  const [output, setOutput] = useState(() => generate(16, { upper: true, lower: true, numbers: true, symbols: false }))

  function regenerate(nextLength = length, nextOptions = options) {
    setOutput(generate(nextLength, nextOptions))
  }

  function toggle(key: keyof typeof CHARSETS) {
    const next = { ...options, [key]: !options[key] }
    setOptions(next)
    regenerate(length, next)
  }

  return (
    <ToolShell title="Random String Generator" description="Generate a random string with your choice of characters.">
      <div className="flex items-center gap-3">
        <label className="text-xs text-white/50">Length</label>
        <input
          type="number"
          min={4}
          max={128}
          value={length}
          onChange={(e) => {
            const next = Math.min(128, Math.max(4, Number(e.target.value) || 4))
            setLength(next)
            regenerate(next, options)
          }}
          className="field w-24"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/50">
        {(Object.keys(CHARSETS) as (keyof typeof CHARSETS)[]).map((key) => (
          <label key={key} className="flex items-center gap-2 capitalize">
            <input type="checkbox" checked={options[key]} onChange={() => toggle(key)} />
            {key}
          </label>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-navy-950 p-3">
        <code className="flex-1 break-all font-mono text-sm text-accent-400">{output || 'Select at least one character set'}</code>
        <CopyButton text={output} />
      </div>

      <button type="button" onClick={() => regenerate()} className="btn-secondary mt-3">
        Regenerate
      </button>
    </ToolShell>
  )
}
