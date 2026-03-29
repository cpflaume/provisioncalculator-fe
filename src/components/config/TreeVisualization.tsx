import { useMemo } from "react"
import { ReactFlow, Background, Controls, type Node, type Edge } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import type { TreeNodeResponse } from "@/api/types"

interface TreeVisualizationProps {
  nodes: TreeNodeResponse[]
  commissions?: Map<string, number>
}

function layoutTree(treeNodes: TreeNodeResponse[]): { nodes: Node[]; edges: Edge[] } {
  if (treeNodes.length === 0) return { nodes: [], edges: [] }

  const childrenMap = new Map<string | null, string[]>()
  for (const node of treeNodes) {
    const parent = node.parentCustomerId
    if (!childrenMap.has(parent)) childrenMap.set(parent, [])
    childrenMap.get(parent)!.push(node.customerId)
  }

  const root = treeNodes.find((n) => n.parentCustomerId === null)
  if (!root) return { nodes: [], edges: [] }

  const flowNodes: Node[] = []
  const flowEdges: Edge[] = []
  const xSpacing = 160
  const ySpacing = 80

  let xCounter = 0

  function traverse(customerId: string, depth: number): number {
    const children = childrenMap.get(customerId) || []
    if (children.length === 0) {
      const x = xCounter * xSpacing
      xCounter++
      flowNodes.push({
        id: customerId,
        position: { x, y: depth * ySpacing },
        data: { label: customerId },
        style: { fontSize: 12, padding: "4px 12px", borderRadius: 8 },
      })
      return x
    }

    const childXPositions = children.map((child) => traverse(child, depth + 1))
    const x = (childXPositions[0] + childXPositions[childXPositions.length - 1]) / 2

    flowNodes.push({
      id: customerId,
      position: { x, y: depth * ySpacing },
      data: { label: customerId },
      style: { fontSize: 12, padding: "4px 12px", borderRadius: 8 },
    })

    for (const child of children) {
      flowEdges.push({
        id: `${customerId}-${child}`,
        source: customerId,
        target: child,
        type: "smoothstep",
      })
    }

    return x
  }

  traverse(root.customerId, 0)
  return { nodes: flowNodes, edges: flowEdges }
}

export function TreeVisualization({ nodes: treeNodes, commissions }: TreeVisualizationProps) {
  const { nodes, edges } = useMemo(() => {
    const layout = layoutTree(treeNodes)
    if (commissions) {
      for (const node of layout.nodes) {
        const amount = commissions.get(node.id)
        if (amount !== undefined) {
          node.data = { label: `${node.id}\n${amount.toFixed(2)} €` }
          node.style = { ...node.style, background: "#dbeafe", border: "1px solid #93c5fd" }
        }
      }
    }
    return layout
  }, [treeNodes, commissions])

  if (treeNodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-gray-400 border border-dashed border-gray-200 rounded-lg">
        Kein Baum definiert
      </div>
    )
  }

  return (
    <div className="h-80 border border-gray-200 rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}
