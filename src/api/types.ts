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
  buyerCustomerId: string
  amount: number
  purchasedAt: string
}

export interface PaginatedPurchases {
  content: Purchase[]
  totalElements: number
  totalPages: number
  page: number
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

// Metrics / KPI types

export interface TenantOverview {
  settlementsByStatus: Record<string, number>
  totalPurchaseVolume: number
  totalCommission: number
  averageCommissionRatePercent: number
}

export interface PurchaseOutlier {
  purchaseId: number
  buyerCustomerId: string
  amount: number
  deviationFactor: number
}

export interface PurchaseAnalysis {
  totalAmount: number
  count: number
  average: number
  min: number
  max: number
  stdDev: number
  outliers: PurchaseOutlier[]
}

export interface DepthBucket {
  depth: number | null
  totalAmount: number
  count: number
}

export interface CommissionOutlier {
  recipientCustomerId: string
  totalCommission: number
  deviationFactor: number
}

export interface CommissionAnalysis {
  totalCommission: number
  recipientCount: number
  byDepth: DepthBucket[]
  outliers: CommissionOutlier[]
}

export interface TheoreticalDepthLine {
  depth: number
  ratePercent: number
  amount: number
}

export interface CrossCheckResult {
  totalPurchaseVolume: number
  theoreticalByDepth: TheoreticalDepthLine[]
  theoreticalTotal: number
  actualTotal: number
  deviationPercent: number
}

export interface SettlementMetrics {
  purchases: PurchaseAnalysis
  commissions: CommissionAnalysis | null
  crossCheck: CrossCheckResult | null
}
