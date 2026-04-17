import { useState, type FormEvent } from "react"
import { AppShell } from "@/components/layout/AppShell"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  useAdminUsers,
  useAdminTenants,
  useActivateUser,
  useDisableUser,
  useCreateTenant,
  useAssignTenant,
  useRevokeTenant,
} from "@/hooks/useAdminData"
import type { AdminUser } from "@/api/admin"

function statusBadge(status: AdminUser["status"]) {
  if (status === "ACTIVE") return <Badge variant="success">Aktiv</Badge>
  if (status === "PENDING") return <Badge variant="warning">Ausstehend</Badge>
  return <Badge variant="secondary">Deaktiviert</Badge>
}

function roleBadge(role: AdminUser["role"]) {
  return role === "ADMIN" ? (
    <Badge variant="info">Admin</Badge>
  ) : (
    <Badge variant="outline">Benutzer</Badge>
  )
}

function UsersTab() {
  const { data: users, isLoading } = useAdminUsers()
  const { data: tenants } = useAdminTenants()
  const activate = useActivateUser()
  const disable = useDisableUser()
  const assign = useAssignTenant()
  const revoke = useRevokeTenant()
  const [selectedTenant, setSelectedTenant] = useState<Record<number, string>>({})

  if (isLoading) return <p className="text-sm text-gray-500">Wird geladen…</p>

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">E-Mail</th>
              <th className="px-4 py-3 text-left font-medium">Rolle</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Mandanten</th>
              <th className="px-4 py-3 text-left font-medium">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users?.map((user) => (
              <tr key={user.userId} className="bg-white hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{user.displayName}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">{roleBadge(user.role)}</td>
                <td className="px-4 py-3">{statusBadge(user.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {user.tenantIds.map((tid) => (
                      <span key={tid} className="flex items-center gap-1">
                        <span className="text-xs bg-gray-100 rounded px-1.5 py-0.5">{tid}</span>
                        <button
                          onClick={() => revoke.mutate({ userId: user.userId, tenantId: tid })}
                          className="text-gray-400 hover:text-red-500 text-xs leading-none"
                          title="Mandant entziehen"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <div className="flex items-center gap-1 mt-1">
                      <select
                        value={selectedTenant[user.userId] ?? ""}
                        onChange={(e) =>
                          setSelectedTenant((p) => ({ ...p, [user.userId]: e.target.value }))
                        }
                        className="text-xs rounded border border-gray-200 px-1 py-0.5"
                      >
                        <option value="">+ Mandant</option>
                        {tenants
                          ?.filter((t) => !user.tenantIds.includes(t.id))
                          .map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.id}
                            </option>
                          ))}
                      </select>
                      {selectedTenant[user.userId] && (
                        <button
                          onClick={() => {
                            assign.mutate({ userId: user.userId, tenantId: selectedTenant[user.userId] })
                            setSelectedTenant((p) => ({ ...p, [user.userId]: "" }))
                          }}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Zuweisen
                        </button>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {user.status !== "ACTIVE" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => activate.mutate(user.userId)}
                        disabled={activate.isPending}
                      >
                        Aktivieren
                      </Button>
                    )}
                    {user.status === "ACTIVE" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => disable.mutate(user.userId)}
                        disabled={disable.isPending}
                      >
                        Deaktivieren
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TenantsTab() {
  const { data: tenants, isLoading } = useAdminTenants()
  const createTenant = useCreateTenant()
  const [newId, setNewId] = useState("")
  const [newName, setNewName] = useState("")

  const handleCreate = (e: FormEvent) => {
    e.preventDefault()
    if (!newId.trim() || !newName.trim()) return
    createTenant.mutate(
      { id: newId.trim(), name: newName.trim() },
      {
        onSuccess: () => {
          setNewId("")
          setNewName("")
        },
      },
    )
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="flex gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Mandant-ID (Slug)</label>
          <Input
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            placeholder="mein-mandant"
            className="h-8 text-sm w-40"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Mein Mandant"
            className="h-8 text-sm w-48"
          />
        </div>
        <Button type="submit" size="sm" disabled={createTenant.isPending || !newId || !newName}>
          Erstellen
        </Button>
      </form>

      {isLoading ? (
        <p className="text-sm text-gray-500">Wird geladen…</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tenants?.map((t) => (
                <tr key={t.id} className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-gray-700">{t.id}</td>
                  <td className="px-4 py-3 text-gray-600">{t.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export function AdminPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
          <p className="text-sm text-gray-500 mt-1">Benutzer und Mandanten verwalten</p>
        </div>
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Benutzer</TabsTrigger>
            <TabsTrigger value="tenants">Mandanten</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-4">
            <UsersTab />
          </TabsContent>
          <TabsContent value="tenants" className="mt-4">
            <TenantsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
