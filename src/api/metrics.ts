import { apiGet } from "./client"
import type { TenantOverview, SettlementMetrics } from "./types"

export function getTenantOverview(tenantId: string): Promise<TenantOverview> {
  return apiGet<TenantOverview>(tenantId, "/metrics/overview")
}

export function getSettlementMetrics(tenantId: string, settlementId: number): Promise<SettlementMetrics> {
  return apiGet<SettlementMetrics>(tenantId, `/settlements/${settlementId}/metrics`)
}
