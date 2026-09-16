import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import AdminGuard from '../../components/AdminGuard'
import { listSettings, updateSetting, type AppSettingRow, AdminApiError } from '../../lib/adminApi'

function SettingsContent() {
  const [settings, setSettings] = useState<AppSettingRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [savedKey, setSavedKey] = useState<string | null>(null)

  function load() {
    listSettings()
      .then((rows) => {
        setSettings(rows)
        setDrafts(Object.fromEntries(rows.map((r) => [r.key, JSON.stringify(r.value)])))
      })
      .catch((err) => setError(err instanceof AdminApiError ? err.message : 'Could not load settings.'))
  }

  useEffect(load, [])

  async function save(key: string) {
    setSavingKey(key)
    setSavedKey(null)
    try {
      const value = JSON.parse(drafts[key])
      await updateSetting(key, value)
      setSavedKey(key)
      load()
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : 'That value needs to be valid JSON (e.g. 1, "text", or true).')
    } finally {
      setSavingKey(null)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-white">Settings</h1>
      <p className="mt-1 text-sm text-white/60">Values are stored as JSON, so a number stays unquoted and text needs quotes.</p>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      {!error && !settings && <p className="mt-4 text-sm text-white/40">Loading…</p>}
      {settings && settings.length === 0 && <p className="mt-4 text-sm text-white/40">No settings rows yet — schema.sql seeds one by default.</p>}

      {settings && settings.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          {settings.map((setting) => (
            <div key={setting.key} className="rounded-lg border border-white/10 bg-navy-900 p-3">
              <p className="font-mono text-xs text-white/50">{setting.key}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  value={drafts[setting.key] ?? ''}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [setting.key]: e.target.value }))}
                  className="field font-mono text-sm"
                />
                <button type="button" onClick={() => save(setting.key)} disabled={savingKey === setting.key} className="btn-primary shrink-0">
                  {savingKey === setting.key ? 'Saving…' : 'Save'}
                </button>
              </div>
              {savedKey === setting.key && <p className="mt-1 text-xs text-emerald-400">Saved.</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminSettings() {
  return (
    <AdminLayout>
      <AdminGuard>
        <SettingsContent />
      </AdminGuard>
    </AdminLayout>
  )
}
