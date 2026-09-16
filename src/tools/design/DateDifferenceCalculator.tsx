import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'

const todayIso = () => new Date().toISOString().slice(0, 10)

export default function DateDifferenceCalculator() {
  const [start, setStart] = useState(todayIso())
  const [end, setEnd] = useState(() => {
    const d = new Date()
    d.setMonth(d.getMonth() + 1)
    return d.toISOString().slice(0, 10)
  })

  const diff = useMemo(() => {
    const s = new Date(start)
    const e = new Date(end)
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null
    const ms = Math.abs(e.getTime() - s.getTime())
    const totalDays = Math.round(ms / (1000 * 60 * 60 * 24))
    return {
      totalDays,
      weeks: Math.floor(totalDays / 7),
      remainderDays: totalDays % 7,
      months: Math.round((totalDays / 30.44) * 10) / 10,
      years: Math.round((totalDays / 365.25) * 100) / 100,
    }
  }, [start, end])

  return (
    <ToolShell title="Date Difference Calculator" description="Find the number of days, weeks, months and years between two dates.">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs text-white/50">Start date</label>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="field mt-1" />
        </div>
        <div>
          <label className="text-xs text-white/50">End date</label>
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="field mt-1" />
        </div>
      </div>

      {!diff ? (
        <p className="mt-4 text-sm text-red-400">Enter two valid dates.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Total days" value={diff.totalDays} />
          <Stat label="Weeks" value={`${diff.weeks}w ${diff.remainderDays}d`} />
          <Stat label="~Months" value={diff.months} />
          <Stat label="~Years" value={diff.years} />
        </div>
      )}
    </ToolShell>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-navy-950 p-3">
      <p className="text-[11px] text-white/40">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold text-white">{value}</p>
    </div>
  )
}
