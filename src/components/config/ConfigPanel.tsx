import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { RatesEditor } from "./RatesEditor"
import { TreeEditor } from "./TreeEditor"
import { TreeVisualization } from "./TreeVisualization"
import { TreeImport } from "./TreeImport"
import { Upload } from "lucide-react"
import type { RateResponse, TreeNodeResponse, GetConfigResponse, ConfigureSettingsRequest } from "@/api/types"

interface ConfigPanelProps {
  config: GetConfigResponse
  onSave: (request: ConfigureSettingsRequest) => void
  readOnly: boolean
}

// To re-sync local state when the underlying config changes (e.g. after a
// refetch), the parent passes `key={config.updatedAt}` which remounts this
// component with fresh initial state.
export function ConfigPanel({ config, onSave, readOnly }: ConfigPanelProps) {
  const [rates, setRates] = useState<RateResponse[]>(config.rates)
  const [nodes, setNodes] = useState<TreeNodeResponse[]>(config.tree)

  const handleRateAdd = (rate: RateResponse) => {
    const newRates = [...rates, rate]
    setRates(newRates)
    onSave({ rates: newRates, tree: nodes })
  }

  const handleRateRemove = (index: number) => {
    const newRates = rates.filter((_, i) => i !== index)
    setRates(newRates)
    onSave({ rates: newRates, tree: nodes })
  }

  const handleTreeAdd = (node: TreeNodeResponse) => {
    const newNodes = [...nodes, node]
    setNodes(newNodes)
    onSave({ rates, tree: newNodes })
  }

  const handleTreeRemove = (customerId: string) => {
    const newNodes = nodes.filter((n) => n.customerId !== customerId)
    setNodes(newNodes)
    onSave({ rates, tree: newNodes })
  }

  const handleImport = (data: ConfigureSettingsRequest) => {
    if (data.rates.length > 0) setRates(data.rates)
    setNodes(data.tree)
    onSave(data)
  }

  return (
    <div className="space-y-6">
      {readOnly && (
        <div className="rounded-md bg-gray-100 px-4 py-3 text-sm text-gray-600">
          Diese Abrechnung ist freigegeben. Die Konfiguration kann nicht mehr geändert werden.
        </div>
      )}

      <Tabs defaultValue="editor">
        <TabsList>
          <TabsTrigger value="editor">Bearbeiten</TabsTrigger>
          <TabsTrigger value="tree">Baumansicht</TabsTrigger>
          {!readOnly && <TabsTrigger value="import"><Upload className="h-3.5 w-3.5 mr-1.5" />Import</TabsTrigger>}
        </TabsList>

        <TabsContent value="editor">
          <div className="space-y-6 mt-4">
            <RatesEditor rates={rates} onAdd={handleRateAdd} onRemove={handleRateRemove} readOnly={readOnly} />
            <TreeEditor nodes={nodes} onAdd={handleTreeAdd} onRemove={handleTreeRemove} readOnly={readOnly} />
          </div>
        </TabsContent>

        <TabsContent value="tree">
          <div className="mt-4">
            <TreeVisualization nodes={nodes} />
          </div>
        </TabsContent>

        {!readOnly && (
          <TabsContent value="import">
            <div className="mt-4">
              <TreeImport onImport={handleImport} />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
