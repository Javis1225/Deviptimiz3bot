import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'

function calculateAge(birthDate: Date, onDate: Date) {
  let years = onDate.getFullYear() - birthDate.getFullYear()
  let months = onDate.getMonth() - birthDate.getMonth()
  let days = onDate.getDate() - birthDate.getDate()

  if (days < 0) {
    months -= 1
    const prevMonth = new Date(onDate.getFullYear(), onDate.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }

  const totalDays = Math.floor((onDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))
  return { years, months, days, totalDays }
}

const todayIso = () => new Date().toISOString().slice(0, 10)

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('2000-01-01')
  const [onDate, setOnDate] = useState(todayIso())

  const result = useMemo(() => {
    const b = new Date(birthDate)
    const o = new Date(onDate)
    if (isNaN(b.getTime()) || isNaN(o.getTime()) || b > o) return null
    return calculateAge(b, o)
  }, [birthDate, onDate])

  return (
    <ToolShell title="Age Calculator" description="Calculate exact age between two dates.">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs text-white/50">Birth date</label>
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="field mt-1" />
        </div>
        <div>
          <label className="text-xs text-white/50">As of</label>
          <input type="date" value={onDate} onChange={(e) => setOnDate(e.target.value)} className="field mt-1" />
        </div>
      </div>

      {!result ? (
        <p className="mt-4 text-sm text-red-400">Birth date must be on or before the "as of" date.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Years" value={result.years} />
          <Stat label="Months" value={result.months} />
          <Stat label="Days" value={result.days} />
          <Stat label="Total days" value={result.totalDays} />
        </div>
      )}
    </ToolShell>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-navy-950 p-3">
      <p className="text-[11px] text-white/40">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold text-white">{value}</p>
    </div>
  )
}
