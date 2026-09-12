import { Share2, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTelegram } from '@/hooks/useTelegram'

export function Header() {
  const { webApp, user } = useTelegram()

  const handleShare = () => {
    if (webApp) {
      // Telegram share
      const url = 'https://t.me/DevOptimizeBot'
      webApp.HapticFeedback?.impactOccurred('light')
      // In production use Telegram share API or clipboard
      navigator.clipboard?.writeText(url)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur border-b border-navy-700">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-navy-900 font-bold text-sm">DO</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">DevOptimizeBot</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-lg hover:bg-navy-700 transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5 text-slate-300" />
          </button>
          <Link
            to="/profile"
            className="p-2 rounded-lg hover:bg-navy-700 transition-colors flex items-center gap-1.5"
          >
            <User className="w-5 h-5 text-slate-300" />
            {user?.first_name && (
              <span className="text-sm text-slate-300 hidden sm:inline">
                {user.first_name}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
