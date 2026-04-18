import { useTenant } from "@/hooks/useTenant"
import { useAuth } from "@/hooks/useAuth"

export function TenantSelector() {
  const { tenantId, setTenantId } = useTenant()
  const { user } = useAuth()
  const tenantIds = user?.tenantIds ?? []

  if (tenantIds.length === 0) return null

  if (tenantIds.length === 1) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Mandant:</span>
        <span data-testid="tenant-display" className="text-sm font-medium text-gray-700">{tenantId}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="tenant-select" className="text-sm text-gray-500 whitespace-nowrap">
        Mandant:
      </label>
      <select
        id="tenant-select"
        data-testid="tenant-display"
        value={tenantId}
        onChange={(e) => setTenantId(e.target.value)}
        className="h-8 text-sm rounded-md border border-gray-200 bg-white px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {tenantIds.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>
    </div>
  )
}
