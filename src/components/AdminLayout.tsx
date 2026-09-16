import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/rewards', label: 'Rewards' },
  { to: '/admin/settings', label: 'Settings' },
  { to: '/admin/catalog-check', label: 'Catalog check' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <nav className="mb-6 flex gap-1 overflow-x-auto border-b border-white/10">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'border-accent-400 text-white' : 'border-transparent text-white/50 hover:text-white/80'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      {children}
    </div>
  )
}
