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
  if (status === "APPROVED") return null

  const anyPending = isCalculating || isApproving || isRejecting

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
      {status === "OPEN" && (
        <Button onClick={onCalculate} disabled={anyPending}>
          <Calculator className="h-4 w-4" />
          {isCalculating ? "Wird berechnet..." : "Berechnen"}
        </Button>
      )}

      {status === "CALCULATED" && (
        <>
          <Button onClick={onApprove} disabled={anyPending}>
            <CheckCircle className="h-4 w-4" />
            {isApproving ? "Wird freigegeben..." : "Freigeben"}
          </Button>
          <Button variant="outline" onClick={onReject} disabled={anyPending}>
            <XCircle className="h-4 w-4" />
            {isRejecting ? "Wird abgelehnt..." : "Ablehnen"}
          </Button>
          <Button variant="outline" onClick={onCalculate} disabled={anyPending}>
            <Calculator className="h-4 w-4" />
            {isCalculating ? "Wird berechnet..." : "Neu berechnen"}
          </Button>
        </>
      )}
    </div>
  )
}
