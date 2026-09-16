import { ReactNode, useEffect, useState } from 'react'
import { ShieldAlert } from 'lucide-react'
import { checkIsAdmin } from '../lib/adminApi'
import { isSupabaseConfigured } from '../lib/supabaseClient'

type Status = 'checking' | 'authorized' | 'denied'

export default function AdminGuard({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('checking')

  useEffect(() => {
    let cancelled = false
    checkIsAdmin().then((isAdmin) => {
      if (!cancelled) setStatus(isAdmin ? 'authorized' : 'denied')
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (status === 'checking') {
    return <p className="text-sm text-white/40">Checking access…</p>
  }

  if (status === 'denied') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-white/10 bg-navy-900 p-8 text-center">
        <ShieldAlert size={28} className="text-red-400" />
        <p className="text-sm text-white/60">
          {isSupabaseConfigured
            ? "This area is for admins only, and your account isn't on the admin list."
            : 'Connect Supabase and add yourself to admin_users to use the dashboard.'}
        </p>
      </div>
    )
  }

  return <>{children}</>
}
