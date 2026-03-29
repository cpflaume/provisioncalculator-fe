import { Badge } from "@/components/ui/badge"
import type { SettlementStatus } from "@/api/types"

const statusConfig: Record<SettlementStatus, { label: string; variant: "success" | "info" | "secondary" | "warning" }> = {
  OPEN: { label: "Offen", variant: "success" },
  CALCULATED: { label: "Berechnet", variant: "info" },
  APPROVED: { label: "Freigegeben", variant: "secondary" },
  REJECTED: { label: "Abgelehnt", variant: "warning" },
}

interface StatusBadgeProps {
  status: SettlementStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
