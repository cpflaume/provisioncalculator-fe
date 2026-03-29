import { apiGet, apiPost } from "./client"
import type { AuditEntry, CalculationResponse, RecipientDetailResponse } from "./types"

export function calculate(tenantId: string, settlementId: number): Promise<CalculationResponse> {
  return apiPost(tenantId, `/settlements/${settlementId}/calculate`)
}

export function getCalculation(tenantId: string, settlementId: number): Promise<CalculationResponse> {
  return apiGet(tenantId, `/settlements/${settlementId}/calculation`)
}

export function getRecipientDetail(
  tenantId: string,
  settlementId: number,
  customerId: string,
): Promise<RecipientDetailResponse> {
  return apiGet(tenantId, `/settlements/${settlementId}/calculation/recipients/${encodeURIComponent(customerId)}`)
}

export function getAuditTrail(tenantId: string, settlementId: number): Promise<AuditEntry[]> {
  return apiGet(tenantId, `/settlements/${settlementId}/calculation/audit`)
}
