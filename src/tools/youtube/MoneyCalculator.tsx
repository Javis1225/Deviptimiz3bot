import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'

export default function MoneyCalculator() {
  const [monthlyViews, setMonthlyViews] = useState(100000)
  const [cpm, setCpm] = useState(4)
  const [monetizedShare, setMonetizedShare] = useState(60)
  const [revenueShare, setRevenueShare] = useState(55)

  const result = useMemo(() => {
    const monetizedViews = monthlyViews * (monetizedShare / 100)
    const grossAdRevenue = (monetizedViews / 1000) * cpm
    const creatorShare = grossAdRevenue * (revenueShare / 100)
    return { grossAdRevenue, creatorShare, yearly: creatorShare * 12 }
  }, [monthlyViews, cpm, monetizedShare, revenueShare])

  const fmt = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`

  return (
    <ToolShell title="YouTube Money Calculator" description="Rough estimate of ad revenue from views and CPM — actual payouts vary a lot by niche, audience country and season.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Monthly views" value={monthlyViews} onChange={setMonthlyViews} />
        <Field label="CPM ($ per 1,000 monetized views)" value={cpm} onChange={setCpm} step={0.1} />
        <Field label="% of views monetized" value={monetizedShare} onChange={setMonetizedShare} />
        <Field label="Creator revenue share (%)" value={revenueShare} onChange={setRevenueShare} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Gross ad revenue" value={fmt(result.grossAdRevenue)} />
        <Stat label="Estimated payout / month" value={fmt(result.creatorShare)} highlight />
        <Stat label="Estimated payout / year" value={fmt(result.yearly)} />
      </div>
      <p className="mt-3 text-[11px] text-white/30">Estimate only — not financial advice, and YouTube's default revenue share (typically 55% for ads) can change.</p>
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
