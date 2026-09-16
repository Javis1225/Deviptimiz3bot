import { useRef, useState } from 'react'
import ToolShell from '../../components/ToolShell'

export default function PngToJpeg() {
  const [quality, setQuality] = useState(0.9)
  const [background, setBackground] = useState('#FFFFFF')
  const [jpegUrl, setJpegUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState('converted')
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function handleFile(file: File) {
    setError(null)
    setJpegUrl(null)
    setFileName(file.name.replace(/\.[^.]+$/, ''))

    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      // JPEG has no alpha channel — fill the background first so transparent
      // areas don't turn black.
      ctx.fillStyle = background
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      setJpegUrl(canvas.toDataURL('image/jpeg', quality))
      URL.revokeObjectURL(url)
    }
    img.onerror = () => setError('Could not load that image.')
    img.src = url
  }

  return (
    <ToolShell title="PNG to JPEG Converter" description="Convert PNG (or any image) to JPEG, with a background fill for transparency.">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="block text-xs text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:text-white"
      />

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-xs text-white/50">
          Background
          <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="h-8 w-8 cursor-pointer rounded border border-white/15 bg-transparent" />
        </label>
        <label className="flex items-center gap-2 text-xs text-white/50">
          Quality: {Math.round(quality * 100)}%
          <input type="range" min={0.4} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-32 accent-accent-400" />
        </label>
      </div>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <canvas ref={canvasRef} className="hidden" />
      {jpegUrl && (
        <div className="mt-4 flex items-center gap-4 rounded-lg border border-white/10 bg-navy-950 p-3">
          <img src={jpegUrl} alt="Converted JPEG preview" className="h-20 w-20 rounded border border-white/10 object-contain" />
          <a href={jpegUrl} download={`${fileName}.jpg`} className="btn-secondary">
            Download JPEG
          </a>
        </div>
      )}
    </ToolShell>
  )
}
