import { useTenant } from "@/hooks/useTenant"
import { Input } from "@/components/ui/input"

export function TenantSelector() {
  const { tenantId, setTenantId } = useTenant()

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="tenant-select" className="text-sm text-gray-500 whitespace-nowrap">
        Mandant:
      </label>
      <Input
        id="tenant-select"
        value={tenantId}
        onChange={(e) => setTenantId(e.target.value)}
        className="w-32 h-8 text-sm"
        placeholder="Mandant-ID"
      />
    </div>
  )
}
