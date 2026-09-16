import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'

const LIMIT_SECONDS = 180 // YouTube Shorts allows up to 3 minutes

export default function ShortsScriptTimer() {
  const [script, setScript] = useState('')
  const [wpm, setWpm] = useState(150) // typical spoken pace for energetic short-form content

  const stats = useMemo(() => {
    const words = script.trim() ? script.trim().split(/\s+/).length : 0
    const seconds = Math.round((words / wpm) * 60)
    return { words, seconds }
  }, [script, wpm])

  const overLimit = stats.seconds > LIMIT_SECONDS
  const pct = Math.min(100, (stats.seconds / LIMIT_SECONDS) * 100)

  return (
    <ToolShell title="YouTube Shorts Script Timer" description="Estimate how long your script will take to say out loud, against the Shorts limit.">
      <textarea value={script} onChange={(e) => setScript(e.target.value)} rows={8} className="field text-sm" placeholder="Paste your script..." />

      <div className="mt-3 flex items-center gap-3">
        <label className="text-xs text-white/50">Speaking pace (words/min)</label>
        <input type="number" min={80} max={220} value={wpm} onChange={(e) => setWpm(Number(e.target.value) || 150)} className="field w-24" />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">{stats.words} words</span>
          <span className={overLimit ? 'font-semibold text-red-400' : 'font-semibold text-emerald-400'}>
            ~{stats.seconds}s / {LIMIT_SECONDS}s limit
          </span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
          <div className={`h-full rounded-full ${overLimit ? 'bg-red-400' : 'bg-accent-400'}`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      {overLimit && <p className="mt-3 text-sm text-red-400">Over the 3-minute Shorts limit by about {stats.seconds - LIMIT_SECONDS}s — trim the script or split it into two.</p>}
      <p className="mt-2 text-[11px] text-white/30">Estimate only — actual pace varies by delivery style and pauses for visuals.</p>
    </ToolShell>
  )
}
