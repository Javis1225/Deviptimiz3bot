import { useState } from 'react'
import { Shuffle } from 'lucide-react'
import ToolShell from '../../components/ToolShell'
import { extractVideoId } from '../../lib/youtubeUrl'
import { callYoutubeData, YoutubeDataError } from '../../lib/youtube'

interface Comment {
  author: string
  text: string
  likeCount: number
}

export default function CommentPicker() {
  const [input, setInput] = useState('')
  const [comments, setComments] = useState<Comment[] | null>(null)
  const [winner, setWinner] = useState<Comment | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function fetchComments() {
    const videoId = extractVideoId(input)
    if (!videoId) {
      setError("Couldn't find a video ID in that input.")
      return
    }
    setLoading(true)
    setError(null)
    setComments(null)
    setWinner(null)
    try {
      const result = await callYoutubeData<{ comments: Comment[] }>('comments', { videoId, maxResults: 100 })
      if (result.comments.length === 0) throw new YoutubeDataError('No comments found on this video.')
      setComments(result.comments)
    } catch (err) {
      setError(err instanceof YoutubeDataError ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function pickRandom() {
    if (!comments || comments.length === 0) return
    const bytes = new Uint32Array(1)
    crypto.getRandomValues(bytes)
    setWinner(comments[bytes[0] % comments.length])
  }

  return (
    <ToolShell title="YouTube Comment Picker" description="Fetch a video's top-level comments and pick one at random — handy for giveaways.">
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Video URL or ID..." className="field" />
        <button type="button" onClick={fetchComments} disabled={loading} className="btn-primary shrink-0">
          {loading ? 'Loading…' : 'Fetch comments'}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {comments && (
        <>
          <p className="mt-3 text-xs text-white/40">{comments.length} comments loaded</p>
          <button type="button" onClick={pickRandom} className="btn-secondary mt-2">
            <Shuffle size={16} />
            Pick a random comment
          </button>
        </>
      )}

      {winner && (
        <div className="mt-4 rounded-lg border border-accent-400/40 bg-accent-400/10 p-4">
          <p className="text-sm text-white">{winner.text}</p>
          <p className="mt-2 text-xs text-white/50">
            — {winner.author} · {winner.likeCount} likes
          </p>
        </div>
      )}
    </ToolShell>
  )
}
