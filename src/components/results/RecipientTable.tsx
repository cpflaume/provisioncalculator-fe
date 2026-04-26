import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronUp } from "lucide-react"
import { formatCurrency } from "@/lib/format"
import type { RecipientTotal } from "@/api/types"

interface RecipientTableProps {
  results: RecipientTotal[]
  onSelect: (customerId: string) => void
  selectedId: string | null
}

type SortField = "customerId" | "totalCommission"
type SortDir = "asc" | "desc"

export function RecipientTable({ results, onSelect, selectedId }: RecipientTableProps) {
  const [sortField, setSortField] = useState<SortField>("totalCommission")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const sorted = [...results].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1
    if (sortField === "customerId") return mul * a.customerId.localeCompare(b.customerId)
    return mul * (a.totalCommission - b.totalCommission)
  })

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDir === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 inline ml-1" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 inline ml-1" />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="cursor-pointer select-none"
            onClick={() => toggleSort("customerId")}
          >
            Empfänger
            {renderSortIcon("customerId")}
          </TableHead>
          <TableHead
            className="text-right cursor-pointer select-none"
            onClick={() => toggleSort("totalCommission")}
          >
            Provision
            {renderSortIcon("totalCommission")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((r) => (
          <TableRow
            key={r.customerId}
            tabIndex={0}
            role="button"
            className={`cursor-pointer hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none ${selectedId === r.customerId ? "bg-blue-50" : ""}`}
            onClick={() => onSelect(selectedId === r.customerId ? "" : r.customerId)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onSelect(selectedId === r.customerId ? "" : r.customerId)
              }
            }}
          >
            <TableCell className="font-medium">{r.customerId}</TableCell>
            <TableCell className="text-right">{formatCurrency(r.totalCommission)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
