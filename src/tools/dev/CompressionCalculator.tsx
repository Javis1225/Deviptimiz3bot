import { useEffect, useState } from 'react'
import ToolShell from '../../components/ToolShell'

async function gzipSize(text: string): Promise<number> {
  const bytes = new TextEncoder().encode(text)
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'))
  const compressed = await new Response(stream).arrayBuffer()
  return compressed.byteLength
}

const SAMPLE = `body {
  font-family: Inter, sans-serif;
  color: #111827;
  line-height: 1.6;
}
.card { border-radius: 12px; padding: 16px; }
.card { border-radius: 12px; padding: 16px; }
.card { border-radius: 12px; padding: 16px; }`

export default function CompressionCalculator() {
  const [input, setInput] = useState(SAMPLE)
  const [gzipBytes, setGzipBytes] = useState<number | null>(null)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    if (typeof CompressionStream === 'undefined') {
      setSupported(false)
      return
    }
    let cancelled = false
    gzipSize(input).then((size) => {
      if (!cancelled) setGzipBytes(size)
    })
    return () => {
      cancelled = true
    }
  }, [input])

  const originalBytes = new TextEncoder().encode(input).length
  const gzipSavings = gzipBytes !== null && originalBytes > 0 ? Math.round((1 - gzipBytes / originalBytes) * 100) : null
  // Brotli typically compresses 10-20% smaller than gzip on text; browsers
  // don't expose native Brotli compression, so this is a labeled estimate,
  // not a measured value like the gzip number above.
  const brotliEstimate = gzipBytes !== null ? Math.round(gzipBytes * 0.85) : null
  const brotliSavings = brotliEstimate !== null && originalBytes > 0 ? Math.round((1 - brotliEstimate / originalBytes) * 100) : null

  return (
    <ToolShell title="Gzip & Brotli Savings Calculator" description="Real gzip size via your browser's compression engine; Brotli is an estimate.">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="field font-mono text-sm" />

      {!supported ? (
        <p className="mt-3 text-sm text-red-400">Your browser doesn't support the Compression Streams API needed for this.</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Original" value={`${originalBytes} B`} />
          <Stat label="Gzip (measured)" value={gzipBytes !== null ? `${gzipBytes} B (\u2212${gzipSavings}%)` : '…'} highlight />
          <Stat label="Brotli (estimate)" value={brotliEstimate !== null ? `~${brotliEstimate} B (\u2212${brotliSavings}%)` : '…'} />
        </div>
      )}
      <p className="mt-3 text-[11px] text-white/30">
        Gzip is computed by actually compressing your text. Brotli isn't available natively in browsers, so that figure is a typical-case estimate (~15% smaller than gzip for text) — measure with your real server/CDN for exact numbers.
      </p>
    </ToolShell>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border border-white/10 bg-navy-950 p-3">
      <p className="text-[11px] text-white/40">{label}</p>
      <p className={`mt-1 font-display text-lg font-semibold ${highlight ? 'text-accent-400' : 'text-white'}`}>{value}</p>
    </div>
  )
}
