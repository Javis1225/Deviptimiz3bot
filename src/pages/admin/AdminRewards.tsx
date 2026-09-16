import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import AdminGuard from '../../components/AdminGuard'
import { listRewardEvents, type AdminRewardEvent, AdminApiError } from '../../lib/adminApi'

const STATUS_STYLES: Record<AdminRewardEvent['status'], string> = {
  pending: 'border-amber-400/40 text-amber-300',
  verified: 'border-emerald-400/40 text-emerald-300',
  rejected: 'border-red-400/40 text-red-300',
}

function RewardsContent() {
  const [events, setEvents] = useState<AdminRewardEvent[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listRewardEvents()
      .then(setEvents)
      .catch((err) => setError(err instanceof AdminApiError ? err.message : 'Could not load reward events.'))
  }, [])

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-white">Rewards</h1>
      <p className="mt-1 text-sm text-white/60">Ad-watch reward events, most recent first.</p>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      {!error && !events && <p className="mt-4 text-sm text-white/40">Loading…</p>}
      {events && events.length === 0 && (
        <p className="mt-4 text-sm text-white/40">
          No reward events yet — they appear once claim-ad-reward and monetag-postback are deployed and someone watches an ad.
        </p>
      )}

      {events && events.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-navy-900 p-3">
              <div>
                <p className="text-sm text-white/80">
                  {event.users?.first_name ?? 'Unknown user'}
                  {event.users?.telegram_username && <span className="text-white/40"> @{event.users.telegram_username}</span>}
                </p>
                <p className="text-xs text-white/40">{new Date(event.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-accent-400">+{event.points_awarded}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[11px] ${STATUS_STYLES[event.status]}`}>{event.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminRewards() {
  return (
    <AdminLayout>
      <AdminGuard>
        <RewardsContent />
      </AdminGuard>
    </AdminLayout>
  )
}
