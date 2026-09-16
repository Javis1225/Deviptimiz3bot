import { useRef, useState } from 'react'
import ToolShell from '../../components/ToolShell'

const SIZES = [16, 32, 48, 180, 192, 512]

export default function FaviconGenerator() {
  const [outputs, setOutputs] = useState<{ size: number; url: string }[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function handleFile(file: File) {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const results = SIZES.map((size) => {
        canvas.width = size
        canvas.height = size
        ctx.clearRect(0, 0, size, size)
        ctx.drawImage(img, 0, 0, size, size)
        return { size, url: canvas.toDataURL('image/png') }
      })
      setOutputs(results)
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  return (
    <ToolShell title="Favicon Generator" description="Upload a square image to generate favicons in standard sizes.">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="block text-xs text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:text-white"
      />
      <p className="mt-2 text-xs text-white/40">Best results with a square source image (at least 512×512).</p>

      <canvas ref={canvasRef} className="hidden" />

      {outputs.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {outputs.map(({ size, url }) => (
            <div key={size} className="flex flex-col items-center gap-1.5 rounded-lg border border-white/10 bg-navy-950 p-2">
              <img src={url} alt={`${size}x${size} favicon`} className="h-10 w-10 rounded" style={{ imageRendering: size <= 32 ? 'pixelated' : 'auto' }} />
              <p className="text-[10px] text-white/40">{size}px</p>
              <a href={url} download={`favicon-${size}.png`} className="text-[10px] text-accent-400 hover:underline">
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </ToolShell>
  )
}
