import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { CommissionAnalysis } from "@/api/types"
import { TrendingUp, AlertTriangle } from "lucide-react"
import { formatCurrency } from "@/lib/format"

interface CommissionAnalysisCardProps {
  data: CommissionAnalysis
}

export function CommissionAnalysisCard({ data }: CommissionAnalysisCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Provisions-Analyse</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3">
          <p className="text-xs text-gray-500">Gesamtprovision</p>
          <p className="text-sm font-semibold text-gray-900 mt-0.5">{formatCurrency(data.totalCommission)}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-gray-500">Empfaenger</p>
          <p className="text-sm font-semibold text-gray-900 mt-0.5">{data.recipientCount}</p>
        </Card>
      </div>

      {data.byDepth.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Verteilung nach Tiefe</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiefe</TableHead>
                <TableHead className="text-right">Summe</TableHead>
                <TableHead className="text-right">Anzahl</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.byDepth.map((bucket) => (
                <TableRow key={bucket.depth ?? "null"}>
                  <TableCell>{bucket.depth ?? "—"}</TableCell>
                  <TableCell className="text-right">{formatCurrency(bucket.totalAmount)}</TableCell>
                  <TableCell className="text-right">{bucket.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {data.outliers.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <p className="text-sm font-medium text-amber-700">
              {data.outliers.length} Provisions-Ausreisser (&gt; 2&sigma;)
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empfaenger</TableHead>
                <TableHead className="text-right">Provision</TableHead>
                <TableHead className="text-right">Abweichung</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.outliers.map((o) => (
                <TableRow key={o.recipientCustomerId}>
                  <TableCell className="font-medium">{o.recipientCustomerId}</TableCell>
                  <TableCell className="text-right">{formatCurrency(o.totalCommission)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={o.deviationFactor > 0 ? "destructive" : "secondary"}>
                      {o.deviationFactor > 0 ? "+" : ""}{o.deviationFactor.toFixed(1)}&sigma;
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {data.outliers.length === 0 && data.recipientCount > 0 && (
        <p className="text-sm text-green-600">Keine Provisions-Ausreisser erkannt.</p>
      )}
    </div>
  )
}
