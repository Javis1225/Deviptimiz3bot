import { useRef, useState } from 'react'
import ToolShell from '../../components/ToolShell'

export default function ImageResizer() {
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null)
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [lockRatio, setLockRatio] = useState(true)
  const [resizedUrl, setResizedUrl] = useState<string | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function handleFile(file: File) {
    setResizedUrl(null)
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      imgRef.current = img
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
      setWidth(img.naturalWidth)
      setHeight(img.naturalHeight)
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  function onWidthChange(next: number) {
    setWidth(next)
    if (lockRatio && naturalSize) setHeight(Math.round((next * naturalSize.h) / naturalSize.w))
  }

  function onHeightChange(next: number) {
    setHeight(next)
    if (lockRatio && naturalSize) setWidth(Math.round((next * naturalSize.w) / naturalSize.h))
  }

  function resize() {
    const img = imgRef.current
    const canvas = canvasRef.current
    if (!img || !canvas) return
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(img, 0, 0, width, height)
    setResizedUrl(canvas.toDataURL('image/png'))
  }

  return (
    <ToolShell title="Image Resizer" description="Resize an image in your browser — nothing is uploaded anywhere.">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="block text-xs text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:text-white"
      />

      {naturalSize && (
        <>
          <p className="mt-2 text-xs text-white/40">
            Original: {naturalSize.w} × {naturalSize.h}px
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/50">Width</label>
              <input type="number" value={width} onChange={(e) => onWidthChange(Number(e.target.value) || 1)} className="field mt-1" />
            </div>
            <div>
              <label className="text-xs text-white/50">Height</label>
              <input type="number" value={height} onChange={(e) => onHeightChange(Number(e.target.value) || 1)} className="field mt-1" />
            </div>
          </div>
          <label className="mt-2 flex items-center gap-2 text-xs text-white/50">
            <input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} />
            Lock aspect ratio
          </label>

          <button type="button" onClick={resize} className="btn-primary mt-3">
            Resize
          </button>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
      {resizedUrl && (
        <div className="mt-4 flex items-center gap-4 rounded-lg border border-white/10 bg-navy-950 p-3">
          <img src={resizedUrl} alt="Resized preview" className="h-20 w-20 rounded border border-white/10 object-contain" />
          <a href={resizedUrl} download="resized.png" className="btn-secondary">
            Download
          </a>
        </div>
      )}
    </ToolShell>
  )
}
