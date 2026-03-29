import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import type { TreeNodeResponse } from "@/api/types"

interface TreeEditorProps {
  nodes: TreeNodeResponse[]
  onChange: (nodes: TreeNodeResponse[]) => void
  readOnly: boolean
}

export function TreeEditor({ nodes, onChange, readOnly }: TreeEditorProps) {
  const [newCustomerId, setNewCustomerId] = useState("")
  const [newParentId, setNewParentId] = useState("")

  const addNode = () => {
    if (!newCustomerId.trim()) return
    const existing = nodes.find((n) => n.customerId === newCustomerId.trim())
    if (existing) return
    onChange([...nodes, { customerId: newCustomerId.trim(), parentCustomerId: newParentId.trim() || null }])
    setNewCustomerId("")
    setNewParentId("")
  }

  const removeNode = (customerId: string) => {
    onChange(nodes.filter((n) => n.customerId !== customerId))
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Kundenbaum</h3>

      {!readOnly && (
        <div className="flex gap-2 items-end" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addNode() } }}>
          <div className="flex-1">
            <label className="text-xs text-gray-500">Kunden-ID</label>
            <Input
              value={newCustomerId}
              onChange={(e) => setNewCustomerId(e.target.value)}
              placeholder="z.B. Alice"
              className="h-8 mt-0.5"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500">Übergeordneter Kunde (leer = Wurzel)</label>
            <Input
              value={newParentId}
              onChange={(e) => setNewParentId(e.target.value)}
              placeholder="z.B. Bob"
              className="h-8 mt-0.5"
            />
          </div>
          <Button variant="outline" size="sm" onClick={addNode} disabled={!newCustomerId.trim()} className="h-8">
            <Plus className="h-3.5 w-3.5" />
            Hinzufügen
          </Button>
        </div>
      )}

      {nodes.length === 0 ? (
        <p className="text-sm text-gray-400">Noch keine Knoten definiert.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kunden-ID</TableHead>
              <TableHead>Übergeordneter Kunde</TableHead>
              {!readOnly && <TableHead className="w-12" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {nodes.map((node) => (
              <TableRow key={node.customerId}>
                <TableCell className="font-medium">{node.customerId}</TableCell>
                <TableCell>{node.parentCustomerId ?? <span className="text-gray-400">(Wurzel)</span>}</TableCell>
                {!readOnly && (
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => removeNode(node.customerId)} className="h-8 w-8">
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <p className="text-xs text-gray-400">{nodes.length} Knoten</p>
    </div>
  )
}
