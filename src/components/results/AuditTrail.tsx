import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuditTrail } from "@/hooks/useCalculation"
import { formatCurrency } from "@/lib/format"

interface AuditTrailProps {
  settlementId: number
}

export function AuditTrail({ settlementId }: AuditTrailProps) {
  const { data: entries, isLoading } = useAuditTrail(settlementId)

  if (isLoading) {
    return <div className="text-sm text-gray-500">Lade Audit-Log...</div>
  }

  if (!entries || entries.length === 0) {
    return <div className="text-sm text-gray-400">Kein Audit-Log vorhanden.</div>
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">{entries.length} Einträge</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empfänger</TableHead>
            <TableHead>Kauf-ID</TableHead>
            <TableHead>Tiefe</TableHead>
            <TableHead className="text-right">Betrag</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{entry.recipientCustomerId}</TableCell>
              <TableCell>{entry.sourcePurchaseId ?? "—"}</TableCell>
              <TableCell>{entry.depth ?? "—"}</TableCell>
              <TableCell className="text-right">{formatCurrency(entry.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
