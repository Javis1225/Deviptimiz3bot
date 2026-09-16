/** Accepts a full YouTube URL (watch, youtu.be, shorts, embed) or a bare 11-char ID. */
export function extractVideoId(input: string): string | null {
  const trimmed = input.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed

  try {
    const url = new URL(trimmed)
    if (url.hostname.includes('youtu.be')) return url.pathname.slice(1).split('/')[0] || null
    if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/shorts/')[1]?.split('/')[0] || null
    if (url.pathname.startsWith('/embed/')) return url.pathname.split('/embed/')[1]?.split('/')[0] || null
    if (url.searchParams.get('v')) return url.searchParams.get('v')
    return null
  } catch {
    return null
  }
}

/** Accepts a channel URL (@handle or /channel/UC...) or a bare handle/ID. */
export function extractChannelRef(input: string): { type: 'handle' | 'id'; value: string } | null {
  const trimmed = input.trim()
  if (/^UC[a-zA-Z0-9_-]{22}$/.test(trimmed)) return { type: 'id', value: trimmed }
  if (trimmed.startsWith('@')) return { type: 'handle', value: trimmed.slice(1) }

  try {
    const url = new URL(trimmed)
    if (url.pathname.startsWith('/channel/')) return { type: 'id', value: url.pathname.split('/channel/')[1]?.split('/')[0] }
    if (url.pathname.startsWith('/@')) return { type: 'handle', value: url.pathname.slice(2).split('/')[0] }
    return null
  } catch {
    return trimmed ? { type: 'handle', value: trimmed } : null
  }
}
