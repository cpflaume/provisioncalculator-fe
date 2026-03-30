import { Card } from "@/components/ui/card"
import { ShoppingCart, Euro } from "lucide-react"

interface PurchaseStatsProps {
  totalCount: number
  totalAmount: number
}

export function PurchaseStats({ totalCount, totalAmount }: PurchaseStatsProps) {
  const formattedAmount = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(totalAmount)

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-gray-100 p-2">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Anzahl Einkäufe</p>
            <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
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
            <p className="text-2xl font-bold text-gray-900">{formattedAmount}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
