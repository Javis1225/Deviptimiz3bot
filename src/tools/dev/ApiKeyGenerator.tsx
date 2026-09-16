import { useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

function secureAlphanumeric(length: number): string {
  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const bytes = new Uint32Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => pool[b % pool.length]).join('')
}

function securePassword(length: number): string {
  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*-_+='
  const bytes = new Uint32Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => pool[b % pool.length]).join('')
}

type Kind = 'apiKey' | 'password'

export default function ApiKeyGenerator() {
  const [kind, setKind] = useState<Kind>('apiKey')
  const [prefix, setPrefix] = useState('devopt_live_')
  const [length, setLength] = useState(32)
  const [value, setValue] = useState(() => `devopt_live_${secureAlphanumeric(32)}`)

  function regenerate(nextKind = kind, nextPrefix = prefix, nextLength = length) {
    const body = nextKind === 'apiKey' ? secureAlphanumeric(nextLength) : securePassword(nextLength)
    setValue(nextKind === 'apiKey' ? `${nextPrefix}${body}` : body)
  }

  return (
    <ToolShell title="API Key & Password Generator" description="Generate a prefixed API key, or a strong random password.">
      <div className="flex gap-2">
        <TabButton label="API key" active={kind === 'apiKey'} onClick={() => { setKind('apiKey'); regenerate('apiKey', prefix, length) }} />
        <TabButton label="Password" active={kind === 'password'} onClick={() => { setKind('password'); regenerate('password', prefix, length) }} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {kind === 'apiKey' && (
          <div>
            <label className="text-xs text-white/50">Prefix</label>
            <input value={prefix} onChange={(e) => { setPrefix(e.target.value); regenerate(kind, e.target.value, length) }} className="field mt-1 w-40 font-mono text-sm" />
          </div>
        )}
        <div>
          <label className="text-xs text-white/50">Length</label>
          <input
            type="number"
            min={8}
            max={64}
            value={length}
            onChange={(e) => {
              const next = Math.min(64, Math.max(8, Number(e.target.value) || 8))
              setLength(next)
              regenerate(kind, prefix, next)
            }}
            className="field mt-1 w-24"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-navy-950 p-3">
        <code className="flex-1 break-all font-mono text-sm text-accent-400">{value}</code>
        <CopyButton text={value} />
      </div>

      <button type="button" onClick={() => regenerate()} className="btn-secondary mt-3">
        Regenerate
      </button>
    </ToolShell>
  )
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
        active ? 'border-accent-400 bg-accent-400 text-accent-ink' : 'border-white/15 text-white/70 hover:border-white/30'
      }`}
    >
      {label}
    </button>
  )
}
