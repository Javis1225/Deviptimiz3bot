import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

const WORDS =
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(
    ' ',
  )

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function randomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)]
}

function makeSentence(): string {
  const length = 6 + Math.floor(Math.random() * 10)
  const words = Array.from({ length }, randomWord)
  return capitalize(words.join(' ')) + '.'
}

function makeParagraph(sentenceCount: number): string {
  return Array.from({ length: sentenceCount }, makeSentence).join(' ')
}

export default function LoremIpsumGenerator() {
  const [unit, setUnit] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs')
  const [count, setCount] = useState(3)
  const [startClassic, setStartClassic] = useState(true)
  const [seed, setSeed] = useState(0) // bump to force regeneration

  const output = useMemo(() => {
    let result: string
    if (unit === 'words') {
      result = capitalize(Array.from({ length: count }, randomWord).join(' ')) + '.'
    } else if (unit === 'sentences') {
      result = Array.from({ length: count }, makeSentence).join(' ')
    } else {
      result = Array.from({ length: count }, () => makeParagraph(4 + Math.floor(Math.random() * 3))).join('\n\n')
    }
    if (startClassic) {
      result = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + result
    }
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, count, startClassic, seed])

  return (
    <ToolShell title="Lorem Ipsum Generator" description="Generate placeholder text by paragraph, sentence or word.">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
          className="field w-20"
        />
        <select value={unit} onChange={(e) => setUnit(e.target.value as typeof unit)} className="field w-auto">
          <option value="paragraphs">Paragraphs</option>
          <option value="sentences">Sentences</option>
          <option value="words">Words</option>
        </select>
        <label className="flex items-center gap-2 text-xs text-white/50">
          <input type="checkbox" checked={startClassic} onChange={(e) => setStartClassic(e.target.checked)} />
          Start with "Lorem ipsum..."
        </label>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button type="button" onClick={() => setSeed((s) => s + 1)} className="btn-secondary">
          Regenerate
        </button>
        <CopyButton text={output} />
      </div>
      <textarea value={output} readOnly rows={10} className="field mt-2 text-sm leading-relaxed" />
    </ToolShell>
  )
}
