import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Share2, UserRound } from 'lucide-react'
import { shareApp } from '../lib/telegram'

const FOOTER_LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Contact', href: '/contact' },
]

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-navy-950 text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-navy-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-display text-lg font-semibold tracking-tight text-white">
            Dev<span className="text-accent-400">Optimize</span>Bot
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => shareApp(window.location.href, 'DevOptimizeBot — one workbench, every tool you need.')}
              className="rounded-full border border-white/15 p-2 text-white/80 hover:border-white/30 hover:text-white"
              aria-label="Share DevOptimizeBot"
            >
              <Share2 size={18} />
            </button>
            <Link
              to="/profile"
              className="rounded-full border border-white/15 p-2 text-white/80 hover:border-white/30 hover:text-white"
              aria-label="Your profile"
            >
              <UserRound size={18} />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>

      <footer className="border-t border-white/10 py-6">
        <nav className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-6 gap-y-2 px-4 text-sm text-white/50">
          {FOOTER_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-white/80">
              {link.label}
            </a>
          ))}
        </nav>
      </footer>
    </div>
  )
}
