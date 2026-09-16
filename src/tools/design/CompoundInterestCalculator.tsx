import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'

const FREQUENCIES = { annually: 1, semiannually: 2, quarterly: 4, monthly: 12, daily: 365 }

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(10000)
  const [rate, setRate] = useState(6)
  const [years, setYears] = useState(10)
  const [frequency, setFrequency] = useState<keyof typeof FREQUENCIES>('monthly')
  const [contribution, setContribution] = useState(100)

  const result = useMemo(() => {
    const n = FREQUENCIES[frequency]
    const r = rate / 100
    const periods = n * years
    const ratePerPeriod = r / n
    const contributionPerPeriod = contribution * (12 / n) // treat "contribution" as monthly, scaled to the period

    let balance = principal
    let totalContributions = principal
    for (let i = 0; i < periods; i++) {
      balance = balance * (1 + ratePerPeriod) + contributionPerPeriod
      totalContributions += contributionPerPeriod
    }
    return {
      finalBalance: balance,
      totalContributions,
      totalInterest: balance - totalContributions,
    }
  }, [principal, rate, years, frequency, contribution])

  const format = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 })

  return (
    <ToolShell title="Compound Interest Calculator" description="Project growth with regular contributions.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Initial principal" value={principal} onChange={setPrincipal} />
        <Field label="Annual interest rate (%)" value={rate} onChange={setRate} step={0.1} />
        <Field label="Years" value={years} onChange={setYears} />
        <Field label="Monthly contribution" value={contribution} onChange={setContribution} />
        <div>
          <label className="text-xs text-white/50">Compounding frequency</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value as keyof typeof FREQUENCIES)} className="field mt-1">
            {Object.keys(FREQUENCIES).map((key) => (
              <option key={key} value={key} className="capitalize">
                {key}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Final balance" value={format(result.finalBalance)} highlight />
        <Stat label="Total contributed" value={format(result.totalContributions)} />
        <Stat label="Total interest earned" value={format(result.totalInterest)} />
      </div>
      <p className="mt-3 text-xs text-white/30">Estimate only — not financial advice.</p>
    </ToolShell>
  )
}

function Field({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (n: number) => void; step?: number }) {
  return (
    <div>
      <label className="text-xs text-white/50">{label}</label>
      <input type="number" step={step} value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} className="field mt-1" />
    </div>
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
