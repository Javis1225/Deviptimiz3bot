import { useState } from 'react'
import ToolShell from '../../components/ToolShell'
import { extractVideoId } from '../../lib/youtubeUrl'
import { callYoutubeData, YoutubeDataError } from '../../lib/youtube'

interface RegionResult {
  title: string
  mode: 'blocked' | 'allowed' | 'none'
  countries: string[]
}

export default function RegionRestrictionChecker() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<RegionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function check() {
    const videoId = extractVideoId(input)
    if (!videoId) {
      setError("Couldn't find a video ID in that input.")
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      setResult(await callYoutubeData<RegionResult>('regionRestriction', { videoId }))
    } catch (err) {
      setError(err instanceof YoutubeDataError ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolShell title="YouTube Region Restriction Checker" description="See which countries a video is blocked in (or exclusively allowed in).">
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Video URL or ID..." className="field" />
        <button type="button" onClick={check} disabled={loading} className="btn-primary shrink-0">
          {loading ? 'Loading…' : 'Check'}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {result && (
        <div className="mt-4">
          <p className="text-sm text-white/70">{result.title}</p>
          {result.mode === 'none' ? (
            <p className="mt-2 text-sm text-emerald-400">No region restrictions — available worldwide.</p>
          ) : (
            <>
              <p className="mt-2 text-sm text-white/60">
                {result.mode === 'blocked' ? 'Blocked in these countries:' : 'Allowed ONLY in these countries:'}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {result.countries.map((c) => (
                  <span key={c} className="rounded-full border border-white/10 bg-navy-950 px-2 py-0.5 text-xs text-white/70">
                    {c}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </ToolShell>
  )
}
