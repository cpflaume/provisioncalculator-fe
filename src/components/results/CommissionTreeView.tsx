import { useMemo } from "react"
import { TreeVisualization } from "@/components/config/TreeVisualization"
import type { TreeNodeResponse, RecipientTotal } from "@/api/types"

interface CommissionTreeViewProps {
  treeNodes: TreeNodeResponse[]
  results: RecipientTotal[]
}

export function CommissionTreeView({ treeNodes, results }: CommissionTreeViewProps) {
  const commissions = useMemo(() => {
    const map = new Map<string, number>()
    for (const r of results) {
      map.set(r.customerId, r.totalCommission)
    }
    return map
  }, [results])

  if (treeNodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-gray-400 border border-dashed border-gray-200 rounded-lg">
        Kein Baum definiert
      </div>
    )
  }

  return <TreeVisualization nodes={treeNodes} commissions={commissions} />
}
