import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import AdminGuard from '../../components/AdminGuard'
import { listUsers, type AdminUserRow, AdminApiError } from '../../lib/adminApi'

function UsersContent() {
  const [users, setUsers] = useState<AdminUserRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch((err) => setError(err instanceof AdminApiError ? err.message : 'Could not load users.'))
  }, [])

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-white">Users</h1>
      <p className="mt-1 text-sm text-white/60">Most recently active first.</p>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      {!error && !users && <p className="mt-4 text-sm text-white/40">Loading…</p>}
      {users && users.length === 0 && <p className="mt-4 text-sm text-white/40">No users yet.</p>}

      {users && users.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-card border border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs text-white/40">
                <th className="px-3 py-2 font-medium">User</th>
                <th className="px-3 py-2 font-medium">Points</th>
                <th className="px-3 py-2 font-medium">Joined</th>
                <th className="px-3 py-2 font-medium">Last seen</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 last:border-0">
                  <td className="px-3 py-2 text-white/80">
                    {user.first_name ?? 'Unknown'}
                    {user.telegram_username && <span className="text-white/40"> @{user.telegram_username}</span>}
                  </td>
                  <td className="px-3 py-2 text-accent-400">{user.points_balance}</td>
                  <td className="px-3 py-2 text-white/50">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-3 py-2 text-white/50">{new Date(user.last_seen_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function AdminUsers() {
  return (
    <AdminLayout>
      <AdminGuard>
        <UsersContent />
      </AdminGuard>
    </AdminLayout>
  )
}
