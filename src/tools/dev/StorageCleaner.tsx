import { useState } from 'react'
import ToolShell from '../../components/ToolShell'

function estimateStorageEntries(): { localStorage: number; sessionStorage: number } {
  return { localStorage: window.localStorage.length, sessionStorage: window.sessionStorage.length }
}

export default function StorageCleaner() {
  const [counts, setCounts] = useState(estimateStorageEntries)
  const [cacheNames, setCacheNames] = useState<string[]>([])
  const [status, setStatus] = useState<string | null>(null)

  async function refresh() {
    setCounts(estimateStorageEntries())
    setCacheNames('caches' in window ? await caches.keys() : [])
  }

  function clearLocal() {
    window.localStorage.clear()
    setStatus('Local storage cleared for this site.')
    refresh()
  }

  function clearSession() {
    window.sessionStorage.clear()
    setStatus('Session storage cleared for this site.')
    refresh()
  }

  async function clearCaches() {
    if (!('caches' in window)) {
      setStatus('Cache Storage API is not available in this browser.')
      return
    }
    const names = await caches.keys()
    await Promise.all(names.map((name) => caches.delete(name)))
    setStatus(`Cleared ${names.length} cache${names.length === 1 ? '' : 's'}.`)
    refresh()
  }

  return (
    <ToolShell
      title="Browser Cache & Storage Cleaner"
      description="Clears this site's own storage. Browsers don't let JavaScript touch other sites' data or the browser's overall HTTP cache — that's a security boundary, not a limitation of this tool."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="localStorage entries" value={counts.localStorage} />
        <Stat label="sessionStorage entries" value={counts.sessionStorage} />
        <Stat label="Cache Storage buckets" value={cacheNames.length} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={clearLocal} className="btn-secondary">
          Clear localStorage
        </button>
        <button type="button" onClick={clearSession} className="btn-secondary">
          Clear sessionStorage
        </button>
        <button type="button" onClick={clearCaches} className="btn-secondary">
          Clear Cache Storage
        </button>
        <button type="button" onClick={refresh} className="btn-secondary">
          Refresh counts
        </button>
      </div>

      {status && <p className="mt-3 text-xs text-emerald-400">{status}</p>}
    </ToolShell>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-navy-950 p-3">
      <p className="text-[11px] text-white/40">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold text-white">{value}</p>
    </div>
  )
}
