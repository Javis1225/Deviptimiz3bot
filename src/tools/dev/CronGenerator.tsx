import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

const PRESETS: { label: string; expr: string }[] = [
  { label: 'Every minute', expr: '* * * * *' },
  { label: 'Every hour', expr: '0 * * * *' },
  { label: 'Every day at midnight', expr: '0 0 * * *' },
  { label: 'Every Monday at 9am', expr: '0 9 * * 1' },
  { label: 'First of every month', expr: '0 0 1 * *' },
]

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function describeCron(expr: string): string {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) return 'A cron expression needs exactly 5 fields: minute hour day month weekday.'
  const [minute, hour, day, month, weekday] = parts

  const timePart =
    minute === '*' && hour === '*'
      ? 'every minute'
      : hour === '*'
        ? `at minute ${minute} of every hour`
        : minute === '0'
          ? `at ${hour.padStart(2, '0')}:00`
          : `at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`

  const dayPart = day === '*' ? '' : ` on day ${day} of the month`
  const monthPart = month === '*' ? '' : ` in month ${month}`
  const weekdayPart =
    weekday === '*'
      ? ''
      : ` on ${weekday
          .split(',')
          .map((w) => WEEKDAYS[Number(w)] ?? w)
          .join(', ')}`

  return `Runs ${timePart}${dayPart}${monthPart}${weekdayPart}`.trim()
}

export default function CronGenerator() {
  const [expr, setExpr] = useState('0 9 * * 1')
  const description = useMemo(() => describeCron(expr), [expr])

  const fields = expr.trim().split(/\s+/)
  const [minute, hour, day, month, weekday] = fields.length === 5 ? fields : ['*', '*', '*', '*', '*']

  function setField(index: number, value: string) {
    const next = [...(fields.length === 5 ? fields : ['*', '*', '*', '*', '*'])]
    next[index] = value || '*'
    setExpr(next.join(' '))
  }

  return (
    <ToolShell title="Cron Expression Generator" description="Build a cron expression and see what it means in plain English.">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button key={p.expr} type="button" onClick={() => setExpr(p.expr)} className="btn-secondary text-xs">
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2">
        <FieldInput label="Minute" value={minute} onChange={(v) => setField(0, v)} />
        <FieldInput label="Hour" value={hour} onChange={(v) => setField(1, v)} />
        <FieldInput label="Day" value={day} onChange={(v) => setField(2, v)} />
        <FieldInput label="Month" value={month} onChange={(v) => setField(3, v)} />
        <FieldInput label="Weekday" value={weekday} onChange={(v) => setField(4, v)} />
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-navy-950 p-3">
        <code className="flex-1 font-mono text-sm text-accent-400">{expr}</code>
        <CopyButton text={expr} />
      </div>
      <p className="mt-2 text-sm text-white/60">{description}</p>
    </ToolShell>
  )
}

function FieldInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px] text-white/40">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="field mt-0.5 px-2 py-1.5 text-center font-mono text-sm" />
    </div>
  )
}
