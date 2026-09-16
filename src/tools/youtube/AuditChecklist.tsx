import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'

const CHECKLIST = [
  { section: 'Channel basics', items: ['Channel name and handle are clear and searchable', 'Profile picture and banner are high-resolution', 'Channel description explains what viewers get and how often you post', 'Links (website, socials) are in "About"', 'Channel keywords are set in Studio'] },
  { section: 'Branding & consistency', items: ['Thumbnails share a consistent visual style', 'Intro/outro branding is consistent across videos', 'A channel trailer is set for new visitors'] },
  { section: 'Per-video SEO', items: ['Titles include the main keyword near the front', 'Descriptions have a strong first two lines (shown in search)', 'Relevant tags are added', 'Videos are placed in the right category', 'Closed captions are accurate (not just auto-generated)'] },
  { section: 'Engagement & structure', items: ['Playlists group related videos', 'End screens link to related videos or a subscribe prompt', 'Cards point to relevant videos mid-watch', 'Pinned comment adds context or a call-to-action'] },
  { section: 'Analytics check', items: ['Reviewed audience retention graphs for recent videos', 'Checked traffic sources (search vs suggested vs external)', 'Compared CTR against channel average'] },
]

export default function AuditChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const totalItems = useMemo(() => CHECKLIST.reduce((sum, s) => sum + s.items.length, 0), [])

  function toggle(item: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(item)) next.delete(item)
      else next.add(item)
      return next
    })
  }

  return (
    <ToolShell title="YouTube Channel Audit Checklist" description="A self-review checklist for channel and video optimization.">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-white/60">
          {checked.size} of {totalItems} checked
        </p>
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-accent-400" style={{ width: `${(checked.size / totalItems) * 100}%` }} />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {CHECKLIST.map((section) => (
          <div key={section.section}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">{section.section}</p>
            <div className="flex flex-col gap-1.5">
              {section.items.map((item) => (
                <label key={item} className="flex cursor-pointer items-start gap-2 rounded-lg border border-white/10 bg-navy-950 p-2.5 text-sm">
                  <input type="checkbox" checked={checked.has(item)} onChange={() => toggle(item)} className="mt-0.5" />
                  <span className={checked.has(item) ? 'text-white/40 line-through' : 'text-white/80'}>{item}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ToolShell>
  )
}
