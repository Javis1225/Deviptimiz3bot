import { useEffect, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

async function sha1Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-1', data)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export default function Sha1Generator() {
  const [input, setInput] = useState('DevOptimizeBot')
  const [hash, setHash] = useState('')

  useEffect(() => {
    let cancelled = false
    sha1Hex(input).then((h) => {
      if (!cancelled) setHash(h)
    })
    return () => {
      cancelled = true
    }
  }, [input])

  return (
    <ToolShell title="SHA-1 Hash Generator" description="Generate a SHA-1 hash. Considered weak for security use — prefer SHA-256 or better.">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} className="field font-mono text-sm" />
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/10 bg-navy-950 p-3">
        <code className="flex-1 break-all font-mono text-sm text-accent-400">{hash}</code>
        <CopyButton text={hash} />
      </div>
    </ToolShell>
  )
}
