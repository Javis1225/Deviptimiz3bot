import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'
import { extractVideoId } from '../../lib/youtubeUrl'

const SIZES = [
  { key: 'default', label: 'Default (120×90)' },
  { key: 'mqdefault', label: 'Medium (320×180)' },
  { key: 'hqdefault', label: 'High (480×360)' },
  { key: 'sddefault', label: 'Standard (640×480)' },
  { key: 'maxresdefault', label: 'Max res (1280×720, if available)' },
]

export default function ThumbnailPreviewer() {
  const [input, setInput] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
  const videoId = useMemo(() => extractVideoId(input), [input])

  return (
    <ToolShell title="YouTube Thumbnail Previewer" description="Preview a video's thumbnail at every available resolution — no API needed, these are public YouTube image URLs.">
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Video URL or ID..." className="field" />

      {!videoId ? (
        <p className="mt-3 text-sm text-red-400">Couldn't find a video ID in that input.</p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {SIZES.map(({ key, label }) => {
            const url = `https://img.youtube.com/vi/${videoId}/${key}.jpg`
            return (
              <div key={key} className="overflow-hidden rounded-lg border border-white/10 bg-navy-950">
                <img src={url} alt={`${label} thumbnail`} className="aspect-video w-full object-cover" />
                <div className="flex items-center justify-between p-2">
                  <p className="text-[11px] text-white/50">{label}</p>
                  <CopyButton text={url} label="" />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </ToolShell>
  )
}
