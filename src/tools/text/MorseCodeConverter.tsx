import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

const MORSE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
  I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
  Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-',
  5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
  '@': '.--.-.',
}
const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE).map(([char, code]) => [code, char]),
)

export function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split(' ')
    .map((word) =>
      word
        .split('')
        .map((ch) => MORSE[ch] ?? '')
        .filter(Boolean)
        .join(' '),
    )
    .join(' / ')
}

export function morseToText(morse: string): string {
  return morse
    .trim()
    .split(' / ')
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .map((code) => REVERSE_MORSE[code] ?? '')
        .join(''),
    )
    .join(' ')
}

export default function MorseCodeConverter() {
  const [direction, setDirection] = useState<'toMorse' | 'toText'>('toMorse')
  const [input, setInput] = useState('SOS DevOptimizeBot')

  const output = useMemo(
    () => (direction === 'toMorse' ? textToMorse(input) : morseToText(input)),
    [input, direction],
  )

  function flip() {
    setDirection((d) => (d === 'toMorse' ? 'toText' : 'toMorse'))
    setInput(output)
  }

  return (
    <ToolShell title="Morse Code Converter" description="Convert text to Morse code and back. Separate words with '/' in Morse.">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-white/50">
          {direction === 'toMorse' ? 'Text' : 'Morse code'}
        </label>
        <button type="button" onClick={flip} className="btn-secondary">
          Swap direction
        </button>
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} className="field mt-1 font-mono text-sm" />

      <div className="mt-3 flex items-center justify-between">
        <label className="text-xs font-medium text-white/50">{direction === 'toMorse' ? 'Morse code' : 'Text'}</label>
        <CopyButton text={output} />
      </div>
      <textarea value={output} readOnly rows={4} className="field mt-1 font-mono text-sm" />
    </ToolShell>
  )
}
