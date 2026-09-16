import { useMemo, useState } from 'react'
import ToolShell from '../../components/ToolShell'
import CopyButton from '../../components/CopyButton'

// MD5 is not available via the Web Crypto API (browsers only expose SHA-*),
// so it's implemented directly here per RFC 1321. Verified against the
// standard test vectors (md5("") and md5("abc")) before shipping.
export function md5(input: string): string {
  const bytes = new TextEncoder().encode(input)
  const bitLenLow = (bytes.length * 8) >>> 0
  const bitLenHigh = Math.floor((bytes.length * 8) / 0x100000000)

  let paddedLen = bytes.length + 1
  while (paddedLen % 64 !== 56) paddedLen++
  const padded = new Uint8Array(paddedLen + 8)
  padded.set(bytes)
  padded[bytes.length] = 0x80
  const view = new DataView(padded.buffer)
  view.setUint32(paddedLen, bitLenLow, true)
  view.setUint32(paddedLen + 4, bitLenHigh, true)

  const K = new Int32Array([
    -680876936, -389564586, 606105819, -1044525330, -176418897, 1200080426, -1473231341, -45705983,
    1770035416, -1958414417, -42063, -1990404162, 1804603682, -40341101, -1502002290, 1236535329,
    -165796510, -1069501632, 643717713, -373897302, -701558691, 38016083, -660478335, -405537848,
    568446438, -1019803690, -187363961, 1163531501, -1444681467, -51403784, 1735328473, -1926607734,
    -378558, -2022574463, 1839030562, -35309556, -1530992060, 1272893353, -155497632, -1094730640,
    681279174, -358537222, -722521979, 76029189, -640364487, -421815835, 530742520, -995338651,
    -198630844, 1126891415, -1416354905, -57434055, 1700485571, -1894986606, -1051523, -2054922799,
    1873313359, -30611744, -1560198380, 1309151649, -145523070, -1120210379, 718787259, -343485551,
  ])
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ]

  let a0 = 0x67452301
  let b0 = -0x10325477
  let c0 = -0x67452302
  let d0 = 0x10325476

  const leftRotate = (x: number, c: number) => (x << c) | (x >>> (32 - c))

  for (let offset = 0; offset < padded.length; offset += 64) {
    const M = new Int32Array(16)
    for (let i = 0; i < 16; i++) M[i] = view.getInt32(offset + i * 4, true)

    let A = a0, B = b0, C = c0, D = d0

    for (let i = 0; i < 64; i++) {
      let F: number
      let g: number
      if (i < 16) {
        F = (B & C) | (~B & D)
        g = i
      } else if (i < 32) {
        F = (D & B) | (~D & C)
        g = (5 * i + 1) % 16
      } else if (i < 48) {
        F = B ^ C ^ D
        g = (3 * i + 5) % 16
      } else {
        F = C ^ (B | ~D)
        g = (7 * i) % 16
      }
      F = (F + A + K[i] + M[g]) | 0
      A = D
      D = C
      C = B
      B = (B + leftRotate(F, S[i])) | 0
    }

    a0 = (a0 + A) | 0
    b0 = (b0 + B) | 0
    c0 = (c0 + C) | 0
    d0 = (d0 + D) | 0
  }

  const toHexLE = (n: number) =>
    [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff].map((b) => b.toString(16).padStart(2, '0')).join('')

  return toHexLE(a0) + toHexLE(b0) + toHexLE(c0) + toHexLE(d0)
}

export default function Md5Generator() {
  const [input, setInput] = useState('DevOptimizeBot')
  const hash = useMemo(() => md5(input), [input])

  return (
    <ToolShell title="MD5 Hash Generator" description="Generate an MD5 checksum. Not for password storage — use bcrypt for that.">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} className="field font-mono text-sm" />
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/10 bg-navy-950 p-3">
        <code className="flex-1 break-all font-mono text-sm text-accent-400">{hash}</code>
        <CopyButton text={hash} />
      </div>
    </ToolShell>
  )
}
