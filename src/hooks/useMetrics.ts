import { useQuery } from "@tanstack/react-query"
import { useTenant } from "./useTenant"
import { getTenantOverview, getSettlementMetrics } from "@/api/metrics"

export function useTenantOverview() {
  const { tenantId } = useTenant()
  return useQuery({
    queryKey: ["tenant-overview", tenantId],
    queryFn: () => getTenantOverview(tenantId),
  })
}

export function useSettlementMetrics(settlementId: number, enabled = true) {
  const { tenantId } = useTenant()
  return useQuery({
    queryKey: ["settlement-metrics", tenantId, settlementId],
    queryFn: () => getSettlementMetrics(tenantId, settlementId),
    enabled,
  })
}
