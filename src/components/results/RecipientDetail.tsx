import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { useRecipientDetail } from "@/hooks/useCalculation"

interface RecipientDetailProps {
  settlementId: number
  customerId: string
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value)
}

export function RecipientDetail({ settlementId, customerId }: RecipientDetailProps) {
  const { data, isLoading } = useRecipientDetail(settlementId, customerId)

  if (isLoading) {
    return <div className="text-sm text-gray-500">Lade Details...</div>
  }

  if (!data) {
    return <div className="text-sm text-gray-400">Keine Details verfügbar.</div>
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-800">{customerId}</h4>
        <span className="text-sm font-bold text-gray-900">
          {formatCurrency(data.totalCommission)}
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quelle (Kauf-ID)</TableHead>
            <TableHead>Tiefe</TableHead>
            <TableHead className="text-right">Betrag</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.details.map((d, i) => (
            <TableRow key={i}>
              <TableCell>{d.sourcePurchaseId ?? "—"}</TableCell>
              <TableCell>{d.depth ?? "—"}</TableCell>
              <TableCell className="text-right">{formatCurrency(d.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
