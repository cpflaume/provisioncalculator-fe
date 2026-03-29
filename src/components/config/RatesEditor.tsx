import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import type { RateResponse } from "@/api/types"

interface RatesEditorProps {
  rates: RateResponse[]
  onChange: (rates: RateResponse[]) => void
  readOnly: boolean
}

export function RatesEditor({ rates, onChange, readOnly }: RatesEditorProps) {
  const addRate = () => {
    const maxDepth = rates.reduce((max, r) => Math.max(max, r.depth), 0)
    onChange([...rates, { depth: maxDepth + 1, ratePercent: 0 }])
  }

  const updateRate = (index: number, field: keyof RateResponse, value: number) => {
    const updated = rates.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    onChange(updated)
  }

  const removeRate = (index: number) => {
    onChange(rates.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Provisionssätze</h3>
        {!readOnly && (
          <Button variant="outline" size="sm" onClick={addRate}>
            <Plus className="h-3.5 w-3.5" />
            Tiefe hinzufügen
          </Button>
        )}
      </div>
      {rates.length === 0 ? (
        <p className="text-sm text-gray-400">Noch keine Provisionssätze definiert.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiefe</TableHead>
              <TableHead>Prozentsatz (%)</TableHead>
              {!readOnly && <TableHead className="w-12" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rates.map((rate, index) => (
              <TableRow key={index}>
                <TableCell>
                  {readOnly ? (
                    rate.depth
                  ) : (
                    <Input
                      type="number"
                      min={1}
                      value={rate.depth}
                      onChange={(e) => updateRate(index, "depth", parseInt(e.target.value) || 0)}
                      className="w-20 h-8"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {readOnly ? (
                    `${rate.ratePercent}%`
                  ) : (
                    <Input
                      type="number"
                      min={0}
                      step={0.1}
                      value={rate.ratePercent}
                      onChange={(e) => updateRate(index, "ratePercent", parseFloat(e.target.value) || 0)}
                      className="w-28 h-8"
                    />
                  )}
                </TableCell>
                {!readOnly && (
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => removeRate(index)} className="h-8 w-8">
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
