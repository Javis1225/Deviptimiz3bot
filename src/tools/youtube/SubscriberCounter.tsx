import { useState } from 'react'
import ToolShell from '../../components/ToolShell'
import { extractChannelRef } from '../../lib/youtubeUrl'
import { callYoutubeData, YoutubeDataError } from '../../lib/youtube'

interface SubResult {
  title: string
  hidden: boolean
  subscriberCount: string | null
  videoCount: string
  viewCount: string
}

export default function SubscriberCounter() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<SubResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function check() {
    const ref = extractChannelRef(input)
    if (!ref) {
      setError("Couldn't parse a channel handle or ID from that input.")
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      setResult(await callYoutubeData<SubResult>('subscriberCount', { channelRef: ref.value, refType: ref.type }))
    } catch (err) {
      setError(err instanceof YoutubeDataError ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolShell title="YouTube Live Subscriber Counter" description="Look up a channel's current subscriber count.">
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="@handle, channel URL, or ID..." className="field" />
        <button type="button" onClick={check} disabled={loading} className="btn-primary shrink-0">
          {loading ? 'Loading…' : 'Check'}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {result && (
        <div className="mt-4 rounded-lg border border-white/10 bg-navy-950 p-4">
          <p className="text-sm text-white/70">{result.title}</p>
          {result.hidden ? (
            <p className="mt-2 text-sm text-white/50">This channel has hidden its subscriber count.</p>
          ) : (
            <p className="mt-1 font-display text-3xl font-semibold text-accent-400">
              {Number(result.subscriberCount).toLocaleString()} <span className="text-sm font-normal text-white/50">subscribers</span>
            </p>
          )}
          <div className="mt-3 flex gap-4 text-xs text-white/40">
            <span>{Number(result.videoCount).toLocaleString()} videos</span>
            <span>{Number(result.viewCount).toLocaleString()} total views</span>
          </div>
        </div>
      )}
    </ToolShell>
  )
}
