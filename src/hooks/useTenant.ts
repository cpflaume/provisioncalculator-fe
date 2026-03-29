import { createContext, useContext } from "react"

interface TenantContextValue {
  tenantId: string
  setTenantId: (id: string) => void
}

export const TenantContext = createContext<TenantContextValue>({
  tenantId: "acme",
  setTenantId: () => {},
})

export function useTenant() {
  return useContext(TenantContext)
}
