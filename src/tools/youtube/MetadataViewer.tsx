import { useState } from 'react'
import ToolShell from '../../components/ToolShell'
import { extractVideoId } from '../../lib/youtubeUrl'
import { callYoutubeData, YoutubeDataError } from '../../lib/youtube'

interface MetadataResult {
  title: string
  description: string
  channelTitle: string
  publishedAt: string
  tags: string[]
  viewCount: string | null
  likeCount: string | null
  commentCount: string | null
  duration: string | null
}

/** ISO 8601 duration (e.g. PT4M13S) -> "4:13" */
function formatDuration(iso: string | null): string {
  if (!iso) return '—'
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return iso
  const [, h, m, s] = match
  const hours = Number(h ?? 0)
  const minutes = Number(m ?? 0)
  const seconds = Number(s ?? 0)
  const parts = hours > 0 ? [hours, String(minutes).padStart(2, '0'), String(seconds).padStart(2, '0')] : [minutes, String(seconds).padStart(2, '0')]
  return parts.join(':')
}

export default function MetadataViewer() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<MetadataResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function fetchMetadata() {
    const videoId = extractVideoId(input)
    if (!videoId) {
      setError("Couldn't find a video ID in that input.")
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      setResult(await callYoutubeData<MetadataResult>('metadata', { videoId }))
    } catch (err) {
      setError(err instanceof YoutubeDataError ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolShell title="YouTube Metadata Viewer" description="Look up a video's title, description, tags, stats and duration.">
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Video URL or ID..." className="field" />
        <button type="button" onClick={fetchMetadata} disabled={loading} className="btn-primary shrink-0">
          {loading ? 'Loading…' : 'Look up'}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {result && (
        <div className="mt-4 flex flex-col gap-3">
          <div>
            <p className="font-display text-lg font-semibold text-white">{result.title}</p>
            <p className="text-xs text-white/40">
              {result.channelTitle} · {new Date(result.publishedAt).toLocaleDateString()} · {formatDuration(result.duration)}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Stat label="Views" value={result.viewCount ? Number(result.viewCount).toLocaleString() : '—'} />
            <Stat label="Likes" value={result.likeCount ? Number(result.likeCount).toLocaleString() : '—'} />
            <Stat label="Comments" value={result.commentCount ? Number(result.commentCount).toLocaleString() : '—'} />
          </div>

          {result.tags.length > 0 && (
            <div>
              <p className="mb-1 text-xs text-white/40">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {result.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-navy-950 px-2 py-0.5 text-xs text-white/70">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-1 text-xs text-white/40">Description</p>
            <p className="whitespace-pre-wrap rounded-lg border border-white/10 bg-navy-950 p-3 text-xs text-white/60">{result.description || '—'}</p>
          </div>
        </div>
      )}
    </ToolShell>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-navy-950 p-3">
      <p className="text-[11px] text-white/40">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold text-white">{value}</p>
    </div>
  )
}
