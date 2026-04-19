import { apiGet, apiPost, apiDelete } from "./client"
import type { PaginatedPurchases, PurchaseResponse, SubmitPurchasesRequest } from "./types"

export function getPurchases(
  tenantId: string,
  settlementId: number,
  page = 0,
  size = 20,
): Promise<PaginatedPurchases> {
  return apiGet(tenantId, `/settlements/${settlementId}/purchases?page=${page}&size=${size}`)
}

export function submitPurchases(
  tenantId: string,
  settlementId: number,
  request: SubmitPurchasesRequest,
): Promise<PurchaseResponse> {
  return apiPost(tenantId, `/settlements/${settlementId}/purchases`, request)
}

export function deletePurchase(
  tenantId: string,
  settlementId: number,
  purchaseId: number,
): Promise<void> {
  return apiDelete(tenantId, `/settlements/${settlementId}/purchases/${purchaseId}`)
}
