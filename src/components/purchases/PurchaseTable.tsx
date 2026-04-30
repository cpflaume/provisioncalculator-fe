import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { formatCurrency, formatDateTime } from "@/lib/format"
import type { Purchase } from "@/api/types"

interface PurchaseTableProps {
  purchases: Purchase[]
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onDelete?: (id: number) => void
}

export function PurchaseTable({ purchases, page, totalPages, onPageChange, onDelete }: PurchaseTableProps) {
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
            {onDelete && <TableHead className="w-12" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.buyerCustomerId}</TableCell>
              <TableCell className="text-right">{formatCurrency(p.amount)}</TableCell>
              <TableCell>{formatDateTime(p.purchasedAt)}</TableCell>
              {onDelete && (
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                    onClick={() => onDelete(p.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              )}
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
