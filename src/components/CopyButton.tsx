import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API can be blocked (permissions, insecure context) — fail quietly.
    }
  }

  return (
    <button type="button" onClick={handleCopy} className="btn-secondary" disabled={!text}>
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? 'Copied' : label}
    </button>
  )
}
