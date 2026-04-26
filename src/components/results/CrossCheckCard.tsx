import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CrossCheckResult } from "@/api/types"
import { ShieldCheck, ShieldAlert } from "lucide-react"
import { formatCurrency } from "@/lib/format"

interface CrossCheckCardProps {
  data: CrossCheckResult
}

export function CrossCheckCard({ data }: CrossCheckCardProps) {
  const isOk = data.deviationPercent <= 0
  const Icon = isOk ? ShieldCheck : ShieldAlert
  const iconColor = isOk ? "text-green-600" : "text-red-600"
  const bgColor = isOk ? "bg-green-50" : "bg-red-50"
  const borderColor = isOk ? "border-green-200" : "border-red-200"
  const statusText = isOk ? "Plausibel" : "Abweichung erkannt"

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <h3 className="text-lg font-semibold text-gray-900">Gegencheck</h3>
      </div>

      <Card className={`p-4 ${bgColor} border ${borderColor}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">{statusText}</p>
            <p className="text-xs text-gray-500 mt-1">
              Theoretisches Maximum vs. tatsaechliche Provision
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{data.deviationPercent.toFixed(2)} %</p>
            <p className="text-xs text-gray-500">Abweichung</p>
          </div>
        </div>
      </Card>

      <p className="text-sm text-gray-500">
        Gesamtumsatz: <span className="font-medium text-gray-900">{formatCurrency(data.totalPurchaseVolume)}</span>
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tiefe</TableHead>
            <TableHead className="text-right">Rate</TableHead>
            <TableHead className="text-right">Theoretisch</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.theoreticalByDepth.map((line) => (
            <TableRow key={line.depth}>
              <TableCell>{line.depth}</TableCell>
              <TableCell className="text-right">{line.ratePercent.toFixed(2)} %</TableCell>
              <TableCell className="text-right">{formatCurrency(line.amount)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="font-semibold border-t-2">
            <TableCell colSpan={2}>Theoretisches Maximum</TableCell>
            <TableCell className="text-right">{formatCurrency(data.theoreticalTotal)}</TableCell>
          </TableRow>
          <TableRow className="font-semibold">
            <TableCell colSpan={2}>Tatsaechliche Provision</TableCell>
            <TableCell className="text-right">{formatCurrency(data.actualTotal)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
