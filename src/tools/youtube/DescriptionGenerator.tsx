import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

export default function DescriptionGenerator() {
  const [hook, setHook] = useState('In this video, I show you exactly how to pull the perfect espresso shot at home.')
  const [chapters, setChapters] = useState('0:00 Intro\n0:45 Grinding the beans\n2:10 Dialing in the shot\n5:30 Final tasting')
  const [links, setLinks] = useState('Gear I use: https://example.com/gear\nInstagram: https://instagram.com/example')
  const [hashtags, setHashtags] = useState('#espresso #coffee #homebarista')

  const output = useMemo(() => {
    const sections = [hook.trim(), chapters.trim() ? `Chapters:\n${chapters.trim()}` : '', links.trim(), hashtags.trim()].filter(Boolean)
    return sections.join('\n\n')
  }, [hook, chapters, links, hashtags])

  return (
    <ToolShell title="YouTube Description Generator" description="Assemble a well-structured video description.">
      <Field label="Opening hook (shows in search results)" value={hook} onChange={setHook} rows={3} />
      <Field label="Chapters (timestamp + label per line)" value={chapters} onChange={setChapters} rows={4} />
      <Field label="Links" value={links} onChange={setLinks} rows={2} />
      <Field label="Hashtags" value={hashtags} onChange={setHashtags} rows={1} />

      <div className="mt-4 flex items-center justify-between">
        <label className="text-xs font-medium text-white/50">Full description</label>
        <CopyButton text={output} />
      </div>
      <textarea value={output} readOnly rows={10} className="field mt-1 text-sm" />
    </ToolShell>
  )
}

function Field({ label, value, onChange, rows }: { label: string; value: string; onChange: (v: string) => void; rows: number }) {
  return (
    <div className="mt-3 first:mt-0">
      <label className="text-xs text-white/50">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="field mt-1 text-sm" />
    </div>
  )
}
