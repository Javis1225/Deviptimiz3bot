import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'
import { extractVideoId } from '../../lib/youtubeUrl'

export default function EmbedGenerator() {
  const [input, setInput] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
  const [width, setWidth] = useState(560)
  const [height, setHeight] = useState(315)
  const [autoplay, setAutoplay] = useState(false)
  const [start, setStart] = useState(0)

  const videoId = useMemo(() => extractVideoId(input), [input])

  const code = useMemo(() => {
    if (!videoId) return ''
    const params = new URLSearchParams()
    if (autoplay) params.set('autoplay', '1')
    if (start > 0) params.set('start', String(start))
    const query = params.toString() ? `?${params.toString()}` : ''
    return `<iframe
  width="${width}"
  height="${height}"
  src="https://www.youtube.com/embed/${videoId}${query}"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>`
  }, [videoId, width, height, autoplay, start])

  return (
    <ToolShell title="YouTube Embed Code Generator" description="Generate an iframe embed for any video.">
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Video URL or ID..." className="field" />

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <NumField label="Width" value={width} onChange={setWidth} />
        <NumField label="Height" value={height} onChange={setHeight} />
        <NumField label="Start (sec)" value={start} onChange={setStart} />
        <label className="flex items-end gap-2 pb-2 text-xs text-white/50">
          <input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} />
          Autoplay
        </label>
      </div>

      {!videoId ? (
        <p className="mt-3 text-sm text-red-400">Couldn't find a video ID in that input.</p>
      ) : (
        <>
          <div className="mt-3 flex justify-end">
            <CopyButton text={code} />
          </div>
          <pre className="field mt-1 overflow-x-auto whitespace-pre font-mono text-xs">{code}</pre>
        </>
      )}
    </ToolShell>
  )
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <label className="text-xs text-white/50">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} className="field mt-1" />
    </div>
  )
}
