import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Purchase } from "@/api/types"

interface PurchaseTableProps {
  purchases: Purchase[]
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value)
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))
}

export function PurchaseTable({ purchases, page, totalPages, onPageChange }: PurchaseTableProps) {
  if (purchases.length === 0) {
    return (
      <div className="rounded-md border border-gray-200 p-8 text-center text-sm text-gray-500">
        Noch keine Einkäufe vorhanden.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Käufer</TableHead>
            <TableHead className="text-right">Betrag</TableHead>
            <TableHead>Kaufdatum</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.buyerCustomerId}</TableCell>
              <TableCell className="text-right">{formatCurrency(p.amount)}</TableCell>
              <TableCell>{formatDate(p.purchasedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Seite {page + 1} von {totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
