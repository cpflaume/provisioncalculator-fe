import { Button } from "@/components/ui/button"
import { Calculator, CheckCircle, XCircle } from "lucide-react"
import type { SettlementStatus } from "@/api/types"

interface ActionBarProps {
  status: SettlementStatus
  onCalculate: () => void
  onApprove: () => void
  onReject: () => void
  isCalculating: boolean
  isApproving: boolean
  isRejecting: boolean
}

export function ActionBar({
  status,
  onCalculate,
  onApprove,
  onReject,
  isCalculating,
  isApproving,
  isRejecting,
}: ActionBarProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
      {status === "OPEN" && (
        <Button onClick={onCalculate} disabled={isCalculating}>
          <Calculator className="h-4 w-4" />
          {isCalculating ? "Wird berechnet..." : "Berechnen"}
        </Button>
      )}

      {status === "CALCULATED" && (
        <>
          <Button onClick={onApprove} disabled={isApproving}>
            <CheckCircle className="h-4 w-4" />
            {isApproving ? "Wird freigegeben..." : "Freigeben"}
          </Button>
          <Button variant="outline" onClick={onReject} disabled={isRejecting}>
            <XCircle className="h-4 w-4" />
            {isRejecting ? "Wird abgelehnt..." : "Ablehnen"}
          </Button>
          <Button variant="outline" onClick={onCalculate} disabled={isCalculating}>
            <Calculator className="h-4 w-4" />
            {isCalculating ? "Wird berechnet..." : "Neu berechnen"}
          </Button>
        </>
      )}

      {status === "APPROVED" && (
        <p className="text-sm text-gray-500">Diese Abrechnung ist freigegeben.</p>
      )}
    </div>
  )
}
