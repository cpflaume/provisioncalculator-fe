import { Card } from "@/components/ui/card"
import { useTenantOverview } from "@/hooks/useMetrics"
import { FileText, Euro, TrendingUp, Percent } from "lucide-react"
import { formatCurrency } from "@/lib/format"

const statusLabels: Record<string, string> = {
  OPEN: "Offen",
  CALCULATED: "Berechnet",
  APPROVED: "Freigegeben",
  REJECTED: "Abgelehnt",
}

export function TenantOverview() {
  const { data, isLoading } = useTenantOverview()

  if (isLoading || !data) return null

  const totalSettlements = Object.values(data.settlementsByStatus).reduce((a, b) => a + b, 0)
  const statusSummary = Object.entries(data.settlementsByStatus)
    .map(([status, count]) => `${count} ${statusLabels[status] ?? status}`)
    .join(" / ")

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-gray-100 p-2">
            <FileText className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Abrechnungen</p>
            <p className="text-2xl font-bold text-gray-900">{totalSettlements}</p>
            <p className="text-xs text-gray-400 mt-0.5">{statusSummary}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-gray-100 p-2">
            <Euro className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Gesamtumsatz</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totalPurchaseVolume)}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatCurrency(data.approvedPurchaseVolume)} Freigegeben / {formatCurrency(data.otherPurchaseVolume)} Andere
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-blue-50 p-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Gesamtprovision</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totalCommission)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-blue-50 p-2">
            <Percent className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Provisionsquote</p>
            <p className="text-2xl font-bold text-gray-900">{data.averageCommissionRatePercent.toFixed(2)} %</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
