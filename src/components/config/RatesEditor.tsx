import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import type { RateResponse } from "@/api/types"

interface RatesEditorProps {
  rates: RateResponse[]
  onAdd: (rate: RateResponse) => void
  onRemove: (index: number) => void
  readOnly: boolean
}

export function RatesEditor({ rates, onAdd, onRemove, readOnly }: RatesEditorProps) {
  const nextDepth = rates.reduce((max, r) => Math.max(max, r.depth), 0) + 1
  const [newDepth, setNewDepth] = useState(nextDepth)
  const [newRatePercent, setNewRatePercent] = useState(0)

  const addRate = () => {
    onAdd({ depth: newDepth, ratePercent: newRatePercent })
    setNewDepth(newDepth + 1)
    setNewRatePercent(0)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Provisionssätze</h3>
      {rates.length === 0 && readOnly ? (
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
                <TableCell>{rate.depth}</TableCell>
                <TableCell>{rate.ratePercent}%</TableCell>
                {!readOnly && (
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => onRemove(index)} className="h-8 w-8">
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {!readOnly && (
              <TableRow>
                <TableCell>
                  <Input
                    type="number"
                    min={1}
                    value={newDepth}
                    onChange={(e) => setNewDepth(parseInt(e.target.value) || 0)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addRate() } }}
                    className="w-20 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    step={0.1}
                    value={newRatePercent}
                    onChange={(e) => setNewRatePercent(parseFloat(e.target.value) || 0)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addRate() } }}
                    className="w-28 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={addRate} className="h-8">
                    <Plus className="h-3.5 w-3.5" />
                    Hinzufügen
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
