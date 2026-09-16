import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

export default function UnixTimestampConverter() {
  const [timestamp, setTimestamp] = useState(String(Math.floor(Date.now() / 1000)))
  const [isoInput, setIsoInput] = useState(() => new Date().toISOString().slice(0, 19))

  const fromTimestamp = useMemo(() => {
    const n = Number(timestamp)
    if (!timestamp || isNaN(n)) return null
    const ms = timestamp.length > 10 ? n : n * 1000
    const date = new Date(ms)
    return isNaN(date.getTime()) ? null : date
  }, [timestamp])

  const toTimestamp = useMemo(() => {
    const date = new Date(isoInput)
    return isNaN(date.getTime()) ? null : Math.floor(date.getTime() / 1000)
  }, [isoInput])

  return (
    <ToolShell title="Unix Timestamp Converter" description="Convert between Unix timestamps and human-readable dates.">
      <div className="rounded-lg border border-white/10 bg-navy-950 p-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-white/50">Unix timestamp (seconds or ms)</label>
          <button type="button" onClick={() => setTimestamp(String(Math.floor(Date.now() / 1000)))} className="text-[11px] text-accent-400 hover:underline">
            Use now
          </button>
        </div>
        <input value={timestamp} onChange={(e) => setTimestamp(e.target.value)} className="field mt-1 font-mono" />
        <p className="mt-2 text-sm text-white/70">
          {fromTimestamp ? fromTimestamp.toUTCString() : <span className="text-red-400">Invalid timestamp</span>}
        </p>
      </div>

      <div className="mt-3 rounded-lg border border-white/10 bg-navy-950 p-3">
        <label className="text-xs text-white/50">Date &amp; time (local)</label>
        <input type="datetime-local" value={isoInput} onChange={(e) => setIsoInput(e.target.value)} className="field mt-1" />
        <div className="mt-2 flex items-center gap-2">
          <p className="flex-1 font-mono text-sm text-accent-400">{toTimestamp ?? 'Invalid date'}</p>
          {toTimestamp !== null && <CopyButton text={String(toTimestamp)} />}
        </div>
      </div>
    </ToolShell>
  )
}
