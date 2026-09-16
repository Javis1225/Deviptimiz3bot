import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

export default function SecurityTxtGenerator() {
  const [contact, setContact] = useState('mailto:security@example.com')
  const [expires, setExpires] = useState(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() + 1)
    return d.toISOString().slice(0, 10)
  })
  const [encryption, setEncryption] = useState('')
  const [languages, setLanguages] = useState('en')
  const [canonical, setCanonical] = useState('https://example.com/.well-known/security.txt')
  const [policy, setPolicy] = useState('')
  const [acknowledgments, setAcknowledgments] = useState('')

  const output = useMemo(() => {
    const lines: string[] = []
    if (contact) lines.push(`Contact: ${contact}`)
    if (expires) lines.push(`Expires: ${new Date(expires).toISOString()}`)
    if (encryption) lines.push(`Encryption: ${encryption}`)
    if (languages) lines.push(`Preferred-Languages: ${languages}`)
    if (canonical) lines.push(`Canonical: ${canonical}`)
    if (policy) lines.push(`Policy: ${policy}`)
    if (acknowledgments) lines.push(`Acknowledgments: ${acknowledgments}`)
    return lines.join('\n')
  }, [contact, expires, encryption, languages, canonical, policy, acknowledgments])

  return (
    <ToolShell title="Security.txt File Generator" description="Build a security.txt file per RFC 9116, for /.well-known/security.txt.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Contact (required)" value={contact} onChange={setContact} placeholder="mailto:security@example.com" />
        <div>
          <label className="text-xs text-white/50">Expires (required)</label>
          <input type="date" value={expires} onChange={(e) => setExpires(e.target.value)} className="field mt-1" />
        </div>
        <Field label="Encryption (optional)" value={encryption} onChange={setEncryption} placeholder="https://example.com/pgp-key.txt" />
        <Field label="Preferred languages" value={languages} onChange={setLanguages} placeholder="en, es" />
        <Field label="Canonical URL" value={canonical} onChange={setCanonical} placeholder="https://example.com/.well-known/security.txt" />
        <Field label="Policy (optional)" value={policy} onChange={setPolicy} placeholder="https://example.com/security-policy" />
        <Field label="Acknowledgments (optional)" value={acknowledgments} onChange={setAcknowledgments} placeholder="https://example.com/hall-of-fame" />
      </div>

      <div className="mt-4 flex justify-end">
        <CopyButton text={output} />
      </div>
      <textarea value={output} readOnly rows={8} className="field mt-1 font-mono text-sm" />
      <p className="mt-2 text-xs text-white/30">Save this as /.well-known/security.txt on your domain.</p>
    </ToolShell>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs text-white/50">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="field mt-1" />
    </div>
  )
}
