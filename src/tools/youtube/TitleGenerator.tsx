import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

const TEMPLATES = (topic: string, year: number) => [
  `${topic}: The Complete Guide (${year})`,
  `How to ${topic} — Step by Step`,
  `${topic} Explained in 5 Minutes`,
  `I Tried ${topic} So You Don't Have To`,
  `The Truth About ${topic}`,
  `${topic} Mistakes Everyone Makes`,
  `Why ${topic} Actually Works`,
  `${topic}: What Nobody Tells You`,
  `10 ${topic} Tips That Actually Work`,
  `${topic} vs Everything Else — Which Wins?`,
]

export default function TitleGenerator() {
  const [topic, setTopic] = useState('home espresso')
  const year = new Date().getFullYear()

  const titles = useMemo(() => (topic.trim() ? TEMPLATES(topic.trim(), year) : []), [topic, year])

  return (
    <ToolShell title="YouTube Video Title Generator" description="Generate title ideas from a topic or keyword.">
      <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Your video topic..." className="field" />

      {titles.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {titles.map((title) => (
            <div key={title} className="flex items-center gap-2 rounded-lg border border-white/10 bg-navy-950 p-3">
              <p className="flex-1 text-sm text-white">{title}</p>
              <CopyButton text={title} label="" />
            </div>
          ))}
        </div>
      )}
      <p className="mt-3 text-[11px] text-white/30">Starting points, not guarantees — the best titles still match what's actually in the video.</p>
    </ToolShell>
  )
}
