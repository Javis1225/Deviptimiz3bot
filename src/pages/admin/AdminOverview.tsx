import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import AdminGuard from '../../components/AdminGuard'
import { getOverview, type AdminOverview as Overview, AdminApiError } from '../../lib/adminApi'

function OverviewContent() {
  const [data, setData] = useState<Overview | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getOverview()
      .then(setData)
      .catch((err) => setError(err instanceof AdminApiError ? err.message : 'Could not load stats.'))
  }, [])

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-white">Overview</h1>
      <p className="mt-1 text-sm text-white/60">A snapshot of activity across DevOptimizeBot.</p>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {!error && !data && <p className="mt-4 text-sm text-white/40">Loading…</p>}

      {data && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Total users" value={data.totalUsers} />
          <Stat label="Tool uses logged" value={data.totalToolUses} />
          <Stat label="Pending rewards" value={data.pendingRewards} />
          <Stat label="Verified rewards" value={data.verifiedRewards} />
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card border border-white/10 bg-navy-900 p-4">
      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-accent-400">{value.toLocaleString()}</p>
    </div>
  )
}

export default function AdminOverview() {
  return (
    <AdminLayout>
      <AdminGuard>
        <OverviewContent />
      </AdminGuard>
    </AdminLayout>
  )
}
