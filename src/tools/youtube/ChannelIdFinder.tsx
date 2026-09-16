import { useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'
import { extractChannelRef } from '../../lib/youtubeUrl'
import { callYoutubeData, YoutubeDataError } from '../../lib/youtube'

interface ChannelIdResult {
  channelId: string
  title?: string
}

export default function ChannelIdFinder() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<ChannelIdResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function find() {
    const ref = extractChannelRef(input)
    if (!ref) {
      setError("Couldn't parse a channel handle or ID from that input.")
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      setResult(await callYoutubeData<ChannelIdResult>('channelId', { channelRef: ref.value, refType: ref.type }))
    } catch (err) {
      setError(err instanceof YoutubeDataError ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolShell title="YouTube Channel ID Finder" description="Resolve a @handle or channel URL to its underlying channel ID (starts with UC...).">
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="@handle, channel URL, or ID..." className="field" />
        <button type="button" onClick={find} disabled={loading} className="btn-primary shrink-0">
          {loading ? 'Loading…' : 'Find'}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {result && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-navy-950 p-3">
          <div className="flex-1">
            {result.title && <p className="text-xs text-white/50">{result.title}</p>}
            <code className="font-mono text-sm text-accent-400">{result.channelId}</code>
          </div>
          <CopyButton text={result.channelId} />
        </div>
      )}
    </ToolShell>
  )
}
