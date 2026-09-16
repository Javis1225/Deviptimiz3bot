import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'
import { extractVideoId } from '../../lib/youtubeUrl'

function parseTimeToSeconds(input: string): number {
  const parts = input.split(':').map((p) => Number(p) || 0)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return parts[0] || 0
}

export default function TimestampLinkMaker() {
  const [input, setInput] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
  const [time, setTime] = useState('1:32')

  const videoId = useMemo(() => extractVideoId(input), [input])
  const seconds = useMemo(() => parseTimeToSeconds(time), [time])

  const shortLink = videoId ? `https://youtu.be/${videoId}?t=${seconds}s` : ''
  const fullLink = videoId ? `https://www.youtube.com/watch?v=${videoId}&t=${seconds}s` : ''
  const embedLink = videoId ? `https://www.youtube.com/embed/${videoId}?start=${seconds}` : ''

  return (
    <ToolShell title="YouTube Timestamp Link Maker" description="Create a link that jumps straight to a specific moment in a video.">
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Video URL or ID..." className="field" />
      <div className="mt-3">
        <label className="text-xs text-white/50">Timestamp (mm:ss or h:mm:ss)</label>
        <input value={time} onChange={(e) => setTime(e.target.value)} className="field mt-1 w-32 font-mono" />
      </div>

      {!videoId ? (
        <p className="mt-3 text-sm text-red-400">Couldn't find a video ID in that input.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          <LinkRow label="Short link (youtu.be)" url={shortLink} />
          <LinkRow label="Full link (youtube.com)" url={fullLink} />
          <LinkRow label="Embed start param" url={embedLink} />
        </div>
      )}
    </ToolShell>
  )
}

function LinkRow({ label, url }: { label: string; url: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-navy-950 p-3">
      <p className="text-[11px] text-white/40">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <code className="flex-1 break-all font-mono text-xs text-accent-400">{url}</code>
        <CopyButton text={url} label="" />
      </div>
    </div>
  )
}
