import { useState } from 'react'
import bcrypt from 'bcryptjs'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

export default function BcryptGenerator() {
  const [password, setPassword] = useState('')
  const [rounds, setRounds] = useState(10)
  const [hash, setHash] = useState('')
  const [busy, setBusy] = useState(false)

  const [verifyHash, setVerifyHash] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null)

  async function generate() {
    if (!password) return
    setBusy(true)
    try {
      const salt = await bcrypt.genSalt(rounds)
      const result = await bcrypt.hash(password, salt)
      setHash(result)
    } finally {
      setBusy(false)
    }
  }

  async function verify() {
    if (!verifyHash || !verifyPassword) return
    try {
      setVerifyResult(await bcrypt.compare(verifyPassword, verifyHash))
    } catch {
      setVerifyResult(false)
    }
  }

  return (
    <ToolShell title="Bcrypt Generator" description="Hash a password with bcrypt, or verify one against an existing hash. Runs entirely in your browser.">
      <div>
        <label className="text-xs text-white/50">Password to hash</label>
        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="field mt-1 font-mono" autoComplete="off" />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <label className="text-xs text-white/50">Cost factor: {rounds}</label>
        <input type="range" min={4} max={14} value={rounds} onChange={(e) => setRounds(Number(e.target.value))} className="w-40 accent-accent-400" />
      </div>
      <p className="mt-1 text-[11px] text-white/30">Higher cost = slower to compute (and to brute-force). 10–12 is typical for servers.</p>

      <button type="button" onClick={generate} disabled={!password || busy} className="btn-primary mt-3">
        {busy ? 'Hashing…' : 'Generate hash'}
      </button>

      {hash && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/10 bg-navy-950 p-3">
          <code className="flex-1 break-all font-mono text-xs text-accent-400">{hash}</code>
          <CopyButton text={hash} />
        </div>
      )}

      <div className="mt-6 border-t border-white/10 pt-4">
        <p className="mb-2 text-xs font-medium text-white/60">Verify a password against a hash</p>
        <input value={verifyHash} onChange={(e) => setVerifyHash(e.target.value)} placeholder="Bcrypt hash..." className="field font-mono text-xs" />
        <input
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
          placeholder="Password to check..."
          className="field mt-2 font-mono"
          autoComplete="off"
        />
        <button type="button" onClick={verify} disabled={!verifyHash || !verifyPassword} className="btn-secondary mt-2">
          Verify
        </button>
        {verifyResult !== null && (
          <p className={`mt-2 text-sm ${verifyResult ? 'text-emerald-400' : 'text-red-400'}`}>
            {verifyResult ? 'Match \u2014 password is correct for this hash.' : "Doesn't match this hash."}
          </p>
        )}
      </div>
    </ToolShell>
  )
}
