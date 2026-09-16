import { useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'
import { extractVideoId } from '../../lib/youtubeUrl'
import { callYoutubeData, YoutubeDataError } from '../../lib/youtube'

interface TagsResult {
  tags: string[]
  title: string
}

export default function TagExtractor() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<TagsResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function extract() {
    const videoId = extractVideoId(input)
    if (!videoId) {
      setError("Couldn't find a video ID in that input.")
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      setResult(await callYoutubeData<TagsResult>('tags', { videoId }))
    } catch (err) {
      setError(err instanceof YoutubeDataError ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolShell title="YouTube Tag Extractor" description="Pull the tags a video was uploaded with (when the owner hasn't hidden them).">
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Video URL or ID..." className="field" />
        <button type="button" onClick={extract} disabled={loading} className="btn-primary shrink-0">
          {loading ? 'Loading…' : 'Extract'}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {result && (
        <div className="mt-4">
          <p className="text-sm text-white/70">{result.title}</p>
          {result.tags.length === 0 ? (
            <p className="mt-2 text-xs text-white/40">No public tags on this video.</p>
          ) : (
            <>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {result.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-navy-950 px-2 py-0.5 text-xs text-white/70">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex justify-end">
                <CopyButton text={result.tags.join(', ')} />
              </div>
            </>
          )}
        </div>
      )}
    </ToolShell>
  )
}
