import { useRef, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

function toHex(n: number): string {
  return n.toString(16).padStart(2, '0')
}

export default function ImageColorPicker() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [picked, setPicked] = useState<{ hex: string; rgb: string } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgElRef = useRef<HTMLImageElement>(null)

  function handleFile(file: File) {
    setPicked(null)
    setImageUrl(URL.createObjectURL(file))
  }

  function drawToCanvas() {
    const img = imgElRef.current
    const canvas = canvasRef.current
    if (!img || !canvas) return
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    canvas.getContext('2d')?.drawImage(img, 0, 0)
  }

  function handleClick(e: React.MouseEvent<HTMLImageElement>) {
    const img = imgElRef.current
    const canvas = canvasRef.current
    if (!img || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = img.getBoundingClientRect()
    const scaleX = img.naturalWidth / rect.width
    const scaleY = img.naturalHeight / rect.height
    const x = Math.floor((e.clientX - rect.left) * scaleX)
    const y = Math.floor((e.clientY - rect.top) * scaleY)

    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data
    setPicked({ hex: `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase(), rgb: `rgb(${r}, ${g}, ${b})` })
  }

  return (
    <ToolShell title="Image Color Picker" description="Upload an image and click anywhere to read that pixel's color.">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="block text-xs text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:text-white"
      />

      {imageUrl && (
        <img
          ref={imgElRef}
          src={imageUrl}
          onLoad={drawToCanvas}
          onClick={handleClick}
          alt="Uploaded — click to pick a color"
          className="mt-3 max-h-72 w-full cursor-crosshair rounded-lg border border-white/10 object-contain"
        />
      )}
      <canvas ref={canvasRef} className="hidden" />

      {picked && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-white/10 bg-navy-950 p-3">
          <div className="h-10 w-10 shrink-0 rounded border border-white/15" style={{ backgroundColor: picked.hex }} />
          <div className="flex-1">
            <p className="font-mono text-sm text-accent-400">{picked.hex}</p>
            <p className="font-mono text-xs text-white/50">{picked.rgb}</p>
          </div>
          <CopyButton text={picked.hex} />
        </div>
      )}
    </ToolShell>
  )
}
