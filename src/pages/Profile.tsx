import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useTelegram } from '@/hooks/useTelegram'
import { awardPoint, authWithTelegram } from '@/lib/api'
import { Gift } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Profile() {
  const { user, webApp } = useTelegram()
  const [points, setPoints] = useState(0)
  const [history, setHistory] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const initData = webApp?.initData
    if (!initData) return
    authWithTelegram(initData).then((res) => {
      if (res.user?.points != null) setPoints(res.user.points)
    }).catch(() => {})
  }, [webApp])

  const watchAd = async () => {
    setBusy(true)
    setMsg('')
    try {
      const initData = webApp?.initData || ''
      // Production: show Monetag rewarded unit, then pass event id.
      const res = await awardPoint(initData)
      if (res.points != null) {
        setPoints(res.points)
        setHistory((h) => ['+1 DevOptimizeBot Point — Rewarded Ad', ...h])
        setMsg(res.message || 'Point awarded')
      } else {
        setMsg(res.error || 'Could not award point (configure Supabase + Monetag)')
      }
    } catch (e: any) {
      setMsg(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-navy-700 mx-auto flex items-center justify-center text-2xl font-bold text-accent">
            {user?.first_name?.[0] || 'U'}
          </div>
          <h1 className="mt-3 text-lg font-semibold">
            {user?.first_name} {user?.last_name}
          </h1>
          {user?.username && (
            <p className="text-sm text-slate-400">@{user.username}</p>
          )}
        </div>

        <div className="rounded-xl border border-navy-600 bg-navy-800/60 p-5 mb-6">
          <p className="text-sm text-slate-400">Current Points</p>
          <p className="text-3xl font-bold text-accent mt-1">{points}</p>
          <p className="text-xs text-slate-500 mt-1">DevOptimizeBot Points</p>
        </div>

        <button
          onClick={watchAd}
          disabled={busy}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-navy-900 font-semibold text-sm hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          <Gift className="w-4 h-4" />
          🎁 Watch Ad +1 Point
        </button>
        {msg && <p className="text-xs text-slate-400 mt-2 text-center">{msg}</p>}

        <div className="mt-8">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">Reward history</h2>
          {history.length === 0 ? (
            <div className="rounded-xl border border-navy-600 bg-navy-800/40 p-4 text-center text-sm text-slate-500">
              No rewards yet. Watch an ad to earn your first DevOptimizeBot Point.
            </div>
          ) : (
            <ul className="space-y-2">
              {history.map((row, i) => (
                <li key={i} className="rounded-lg border border-navy-600 bg-navy-800/60 px-3 py-2 text-sm text-slate-200">
                  {row}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
