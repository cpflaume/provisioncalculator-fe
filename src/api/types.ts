export type SettlementStatus = "OPEN" | "CALCULATED" | "APPROVED" | "REJECTED"

export interface Settlement {
  id: number
  tenantId: string
  name: string
  status: SettlementStatus
  createdAt: string
}

export interface RateResponse {
  depth: number
  ratePercent: number
}

export interface TreeNodeResponse {
  customerId: string
  parentCustomerId: string | null
}

export interface ConfigResponse {
  settlementId: number
  rates: RateResponse[]
  nodeCount: number
  updatedAt: string
}

export interface GetConfigResponse {
  settlementId: number
  rates: RateResponse[]
  tree: TreeNodeResponse[]
  nodeCount: number
  updatedAt: string
}

export interface StatusResponse {
  settlementId: number
  status: string
}

// Requests
export interface CreateSettlementRequest {
  name: string
}

export interface ConfigureSettingsRequest {
  rates: RateResponse[]
  tree: TreeNodeResponse[]
}

export interface PurchaseRequest {
  buyerCustomerId: string
  amount: number
  purchasedAt: string
}

export interface SubmitPurchasesRequest {
  purchases: PurchaseRequest[]
}

// Purchase responses
export interface PurchaseResponse {
  settlementId: number
  accepted: number
  submittedAt: string
}

export interface Purchase {
  id: number
  tenantId: string
  buyerCustomerId: string
  amount: number
  purchasedAt: string
}

export interface PaginatedPurchases {
  content: Purchase[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

// Calculation responses
export interface RecipientTotal {
  customerId: string
  totalCommission: number
}

export interface CalculationResponse {
  calculationId: string
  settlementId: number
  calculatedAt: string
  fromCache: boolean
  results: RecipientTotal[]
}

export interface CommissionDetail {
  sourcePurchaseId: number | null
  amount: number
  depth: number | null
  ruleId: string
}

export interface RecipientDetailResponse {
  customerId: string
  totalCommission: number
  details: CommissionDetail[]
}

export interface AuditEntry {
  recipientCustomerId: string
  sourcePurchaseId: number | null
  amount: number
  depth: number | null
  ruleId: string
}
