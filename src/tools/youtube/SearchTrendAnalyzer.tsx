import { useState } from 'react'
import ToolShell from '../../components/ToolShell'
import { callYoutubeData, YoutubeDataError } from '../../lib/youtube'

interface SearchResult {
  totalResults: number
  results: { videoId: string; title: string; channelTitle: string; publishedAt: string }[]
}

export default function SearchTrendAnalyzer() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<SearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function search() {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      setResult(await callYoutubeData<SearchResult>('searchTrend', { query: query.trim() }))
    } catch (err) {
      setError(err instanceof YoutubeDataError ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolShell title="YouTube Search Trend Analyzer" description="See how much content already exists for a keyword, and what's currently ranking for it.">
      <div className="flex gap-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Keyword or topic..." className="field" onKeyDown={(e) => e.key === 'Enter' && search()} />
        <button type="button" onClick={search} disabled={loading} className="btn-primary shrink-0">
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {result && (
        <div className="mt-4">
          <p className="text-sm text-white/60">~{result.totalResults.toLocaleString()} results for this keyword</p>
          <div className="mt-3 flex flex-col gap-2">
            {result.results.map((r) => (
              <a
                key={r.videoId}
                href={`https://www.youtube.com/watch?v=${r.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-white/10 bg-navy-950 p-3 hover:border-accent-400/50"
              >
                <p className="text-sm text-white">{r.title}</p>
                <p className="mt-1 text-xs text-white/40">
                  {r.channelTitle} · {new Date(r.publishedAt).toLocaleDateString()}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
      <p className="mt-3 text-[11px] text-white/30">Top 10 by relevance — this call uses more of your daily YouTube API quota than the other tools here (100 units vs 1).</p>
    </ToolShell>
  )
}
