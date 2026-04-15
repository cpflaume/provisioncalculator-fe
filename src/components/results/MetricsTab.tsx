import { useSettlementMetrics } from "@/hooks/useMetrics"
import { PurchaseAnalysisCard } from "./PurchaseAnalysisCard"
import { CommissionAnalysisCard } from "./CommissionAnalysisCard"
import { CrossCheckCard } from "./CrossCheckCard"

interface MetricsTabProps {
  settlementId: number
}

export function MetricsTab({ settlementId }: MetricsTabProps) {
  const { data, isLoading } = useSettlementMetrics(settlementId)

  if (isLoading) {
    return <div className="text-sm text-gray-500">Lade Analyse...</div>
  }

  if (!data) {
    return <div className="text-sm text-gray-400">Keine Analysedaten verfuegbar.</div>
  }

  return (
    <div className="space-y-8">
      <PurchaseAnalysisCard data={data.purchases} />

      {data.commissions && <CommissionAnalysisCard data={data.commissions} />}

      {data.crossCheck && <CrossCheckCard data={data.crossCheck} />}
    </div>
  )
}
