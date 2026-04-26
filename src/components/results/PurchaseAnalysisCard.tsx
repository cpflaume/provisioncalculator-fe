import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { PurchaseAnalysis } from "@/api/types"
import { ShoppingCart, AlertTriangle } from "lucide-react"
import { formatCurrency } from "@/lib/format"

interface PurchaseAnalysisCardProps {
  data: PurchaseAnalysis
}

export function PurchaseAnalysisCard({ data }: PurchaseAnalysisCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Kauf-Analyse</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Summe", value: formatCurrency(data.totalAmount) },
          { label: "Anzahl", value: data.count.toString() },
          { label: "Durchschnitt", value: formatCurrency(data.average) },
          { label: "Min", value: formatCurrency(data.min) },
          { label: "Max", value: formatCurrency(data.max) },
          { label: "Std.-Abw.", value: formatCurrency(data.stdDev) },
        ].map((stat) => (
          <Card key={stat.label} className="p-3">
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">{stat.value}</p>
          </Card>
        ))}
      </div>

      {data.outliers.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <p className="text-sm font-medium text-amber-700">
              {data.outliers.length} Ausreisser erkannt (&gt; 2&sigma;)
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kauf-ID</TableHead>
                <TableHead>Kaeufer</TableHead>
                <TableHead className="text-right">Betrag</TableHead>
                <TableHead className="text-right">Abweichung</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.outliers.map((o) => (
                <TableRow key={o.purchaseId}>
                  <TableCell>{o.purchaseId}</TableCell>
                  <TableCell className="font-medium">{o.buyerCustomerId}</TableCell>
                  <TableCell className="text-right">{formatCurrency(o.amount)}</TableCell>
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

      {data.outliers.length === 0 && data.count > 0 && (
        <p className="text-sm text-green-600">Keine Ausreisser erkannt.</p>
      )}
    </div>
  )
}
