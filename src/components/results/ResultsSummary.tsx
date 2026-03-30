import { Card } from "@/components/ui/card"
import { Users, Euro } from "lucide-react"
import type { RecipientTotal } from "@/api/types"

interface ResultsSummaryProps {
  results: RecipientTotal[]
  calculatedAt: string
}

export function ResultsSummary({ results, calculatedAt }: ResultsSummaryProps) {
  const totalCommission = results.reduce((sum, r) => sum + r.totalCommission, 0)
  const formattedTotal = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(totalCommission)
  const formattedDate = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(calculatedAt))

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-50 p-2">
              <Euro className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Gesamtprovision</p>
              <p className="text-2xl font-bold text-gray-900">{formattedTotal}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-50 p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Empfänger</p>
              <p className="text-2xl font-bold text-gray-900">{results.length}</p>
            </div>
          </div>
        </Card>
      </div>
      <p className="text-xs text-gray-400">Berechnet am {formattedDate}</p>
    </div>
  )
}
