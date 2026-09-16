import { useEffect, useState } from 'react'
import { Gift, UserRound } from 'lucide-react'
import { getTelegramUser } from '../lib/telegram'
import { getMyPoints, claimAdReward, type PointsState } from '../lib/points'
import { showRewardedAd } from '../lib/monetag'

export default function Profile() {
  const telegramUser = getTelegramUser()
  const [points, setPoints] = useState<PointsState>({ status: 'signed-out', balance: null })
  const [adStatus, setAdStatus] = useState<string | null>(null)
  const [loadingAd, setLoadingAd] = useState(false)

  useEffect(() => {
    getMyPoints().then(setPoints)
  }, [])

  async function handleWatchAd() {
    setLoadingAd(true)
    setAdStatus(null)
    const watched = await showRewardedAd()
    if (!watched) {
      setAdStatus('Ad was closed before finishing \u2014 no reward this time.')
      setLoadingAd(false)
      return
    }
    const result = await claimAdReward()
    setAdStatus(result.message)
    setLoadingAd(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-navy-900">
          <UserRound size={22} className="text-white/60" />
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-white">
            {telegramUser ? `${telegramUser.first_name}${telegramUser.username ? ` (@${telegramUser.username})` : ''}` : 'Guest'}
          </p>
          <p className="text-xs text-white/50">
            {telegramUser ? 'Signed in via Telegram' : 'Open inside Telegram to see your profile'}
          </p>
        </div>
      </div>

      <div className="rounded-card border border-white/10 bg-navy-900 p-5">
        <p className="text-xs uppercase tracking-wide text-white/40">DevOptimizeBot Points</p>
        <p className="mt-1 font-display text-3xl font-semibold text-accent-400">
          {points.status === 'ready' ? points.balance : '—'}
        </p>
        {points.status !== 'ready' && (
          <p className="mt-1 text-xs text-white/40">
            {points.status === 'no-backend'
              ? 'Connect Supabase to track points.'
              : 'Sign-in isn\u2019t wired up yet \u2014 coming in the next build phase.'}
          </p>
        )}

        <button type="button" onClick={handleWatchAd} disabled={loadingAd} className="btn-primary mt-4 w-full">
          <Gift size={16} />
          {loadingAd ? 'Loading ad…' : 'Watch Ad +1 Point'}
        </button>
        {adStatus && <p className="mt-2 text-xs text-white/50">{adStatus}</p>}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-white/80">Reward history</p>
        <p className="rounded-card border border-white/10 bg-navy-900 p-4 text-xs text-white/40">
          Your reward history will appear here once the backend is connected.
        </p>
      </div>
    </div>
  )
}
