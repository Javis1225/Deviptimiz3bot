import { ReactNode } from 'react'

export default function ToolShell({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-white">{title}</h1>
      {description && <p className="mt-1 max-w-xl text-sm text-white/60">{description}</p>}
      <div className="mt-5 rounded-card border border-white/10 bg-navy-900 p-4 sm:p-5">{children}</div>
    </div>
  )
}
