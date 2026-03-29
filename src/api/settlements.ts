import { apiGet, apiPost, apiPut } from "./client"
import type {
  Settlement,
  SettlementStatus,
  CreateSettlementRequest,
  ConfigureSettingsRequest,
  ConfigResponse,
  GetConfigResponse,
  StatusResponse,
} from "./types"

export function getSettlements(tenantId: string, status?: SettlementStatus): Promise<Settlement[]> {
  const query = status ? `?status=${status}` : ""
  return apiGet(tenantId, `/settlements${query}`)
}

export function getSettlement(tenantId: string, settlementId: number): Promise<Settlement> {
  return apiGet(tenantId, `/settlements/${settlementId}`)
}

export function createSettlement(tenantId: string, request: CreateSettlementRequest): Promise<Settlement> {
  return apiPost(tenantId, "/settlements", request)
}

export function configureSettlement(
  tenantId: string,
  settlementId: number,
  request: ConfigureSettingsRequest,
): Promise<ConfigResponse> {
  return apiPut(tenantId, `/settlements/${settlementId}/config`, request)
}

export function getConfig(tenantId: string, settlementId: number): Promise<GetConfigResponse> {
  return apiGet(tenantId, `/settlements/${settlementId}/config`)
}

export function approveSettlement(tenantId: string, settlementId: number): Promise<StatusResponse> {
  return apiPost(tenantId, `/settlements/${settlementId}/approve`)
}

export function rejectSettlement(tenantId: string, settlementId: number): Promise<StatusResponse> {
  return apiPost(tenantId, `/settlements/${settlementId}/reject`)
}
