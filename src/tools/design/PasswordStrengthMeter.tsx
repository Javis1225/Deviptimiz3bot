import { useMemo, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import ToolShell from '../../components/ToolShell'

const COMMON_PASSWORDS = new Set(['password', '123456', 'qwerty', 'letmein', 'admin', 'welcome', 'abc123', 'password1'])

function scorePassword(pw: string) {
  if (!pw) return { score: 0, label: 'Empty', feedback: [] as string[] }

  let score = 0
  const feedback: string[] = []

  const hasLower = /[a-z]/.test(pw)
  const hasUpper = /[A-Z]/.test(pw)
  const hasDigit = /[0-9]/.test(pw)
  const hasSymbol = /[^a-zA-Z0-9]/.test(pw)
  const varietyCount = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length

  if (pw.length >= 8) score += 1
  else feedback.push('Use at least 8 characters')
  if (pw.length >= 12) score += 1
  if (pw.length >= 16) score += 1

  score += Math.max(0, varietyCount - 1)
  if (varietyCount < 3) feedback.push('Mix uppercase, lowercase, numbers and symbols')

  if (COMMON_PASSWORDS.has(pw.toLowerCase())) {
    score = 0
    feedback.push('This is one of the most commonly leaked passwords')
  }
  if (/^(.)\1+$/.test(pw)) {
    score = Math.min(score, 1)
    feedback.push('Avoid repeating the same character')
  }
  if (/^(0123456789|abcdefgh|qwertyui)/i.test(pw)) {
    feedback.push('Avoid keyboard or sequential patterns')
  }

  const clamped = Math.max(0, Math.min(5, score))
  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong']
  return { score: clamped, label: labels[clamped], feedback }
}

const BAR_COLORS = ['bg-red-500', 'bg-red-400', 'bg-amber-400', 'bg-yellow-300', 'bg-lime-400', 'bg-emerald-400']

export default function PasswordStrengthMeter() {
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)

  const result = useMemo(() => scorePassword(password), [password])

  return (
    <ToolShell title="Password Strength Meter" description="Checked entirely in your browser — nothing is sent anywhere or stored.">
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type a password to check..."
          className="field pr-10 font-mono"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className="mt-3 flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < result.score ? BAR_COLORS[result.score] : 'bg-white/10'}`} />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-white/60">{password ? result.label : 'Waiting for input'}</p>

      {result.feedback.length > 0 && (
        <ul className="mt-3 list-inside list-disc text-xs text-white/50">
          {result.feedback.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
    </ToolShell>
  )
}
