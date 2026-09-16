import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'

export default function PercentageCalculator() {
  const [percent, setPercent] = useState(15)
  const [base, setBase] = useState(200)

  const [partA, setPartA] = useState(30)
  const [wholeA, setWholeA] = useState(150)

  const [fromValue, setFromValue] = useState(80)
  const [toValue, setToValue] = useState(100)

  const result1 = useMemo(() => (percent / 100) * base, [percent, base])
  const result2 = useMemo(() => (wholeA === 0 ? 0 : (partA / wholeA) * 100), [partA, wholeA])
  const result3 = useMemo(() => (fromValue === 0 ? 0 : ((toValue - fromValue) / Math.abs(fromValue)) * 100), [fromValue, toValue])

  return (
    <ToolShell title="Percentage Calculator" description="Three common percentage calculations.">
      <div className="flex flex-col gap-5">
        <Block title="X% of Y">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <input type="number" value={percent} onChange={(e) => setPercent(Number(e.target.value) || 0)} className="field w-24" />
            <span className="text-white/50">% of</span>
            <input type="number" value={base} onChange={(e) => setBase(Number(e.target.value) || 0)} className="field w-28" />
            <span className="text-white/50">=</span>
            <span className="font-display text-lg font-semibold text-accent-400">{round(result1)}</span>
          </div>
        </Block>

        <Block title="X is what % of Y">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <input type="number" value={partA} onChange={(e) => setPartA(Number(e.target.value) || 0)} className="field w-24" />
            <span className="text-white/50">is what % of</span>
            <input type="number" value={wholeA} onChange={(e) => setWholeA(Number(e.target.value) || 0)} className="field w-28" />
            <span className="text-white/50">=</span>
            <span className="font-display text-lg font-semibold text-accent-400">{round(result2)}%</span>
          </div>
        </Block>

        <Block title="% change from X to Y">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <input type="number" value={fromValue} onChange={(e) => setFromValue(Number(e.target.value) || 0)} className="field w-24" />
            <span className="text-white/50">to</span>
            <input type="number" value={toValue} onChange={(e) => setToValue(Number(e.target.value) || 0)} className="field w-24" />
            <span className="text-white/50">=</span>
            <span className={`font-display text-lg font-semibold ${result3 >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {result3 >= 0 ? '+' : ''}
              {round(result3)}%
            </span>
          </div>
        </Block>
      </div>
    </ToolShell>
  )
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-navy-950 p-3">
      <p className="mb-2 text-xs text-white/40">{title}</p>
      {children}
    </div>
  )
}
