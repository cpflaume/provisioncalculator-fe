import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { RecipientTotal } from "@/api/types"

interface RecipientTableProps {
  results: RecipientTotal[]
  onSelect: (customerId: string) => void
  selectedId: string | null
}

type SortField = "customerId" | "totalCommission"
type SortDir = "asc" | "desc"

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value)
}

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

  const SortIcon = ({ field }: { field: SortField }) => {
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
            <SortIcon field="customerId" />
          </TableHead>
          <TableHead
            className="text-right cursor-pointer select-none"
            onClick={() => toggleSort("totalCommission")}
          >
            Provision
            <SortIcon field="totalCommission" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((r) => (
          <TableRow
            key={r.customerId}
            className={`cursor-pointer hover:bg-gray-50 ${selectedId === r.customerId ? "bg-blue-50" : ""}`}
            onClick={() => onSelect(r.customerId)}
          >
            <TableCell className="font-medium">{r.customerId}</TableCell>
            <TableCell className="text-right">{formatCurrency(r.totalCommission)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
