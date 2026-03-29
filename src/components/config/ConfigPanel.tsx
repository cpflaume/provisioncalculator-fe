import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RatesEditor } from "./RatesEditor"
import { TreeEditor } from "./TreeEditor"
import { TreeVisualization } from "./TreeVisualization"
import { TreeImport } from "./TreeImport"
import { Save, Upload } from "lucide-react"
import type { RateResponse, TreeNodeResponse, GetConfigResponse, ConfigureSettingsRequest } from "@/api/types"

interface ConfigPanelProps {
  config: GetConfigResponse | undefined
  onSave: (request: ConfigureSettingsRequest) => void
  isSaving: boolean
  readOnly: boolean
}

export function ConfigPanel({ config, onSave, isSaving, readOnly }: ConfigPanelProps) {
  const [rates, setRates] = useState<RateResponse[]>([])
  const [nodes, setNodes] = useState<TreeNodeResponse[]>([])

  useEffect(() => {
    if (config) {
      setRates(config.rates)
      setNodes(config.tree)
    }
  }, [config])

  const handleImport = (data: ConfigureSettingsRequest) => {
    setRates(data.rates)
    setNodes(data.tree)
  }

  const handleSave = () => {
    onSave({ rates, tree: nodes })
  }

  const hasChanges =
    JSON.stringify(rates) !== JSON.stringify(config?.rates ?? []) ||
    JSON.stringify(nodes) !== JSON.stringify(config?.tree ?? [])

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
            <RatesEditor rates={rates} onChange={setRates} readOnly={readOnly} />
            <TreeEditor nodes={nodes} onChange={setNodes} readOnly={readOnly} />
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

      {!readOnly && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
            <Save className="h-4 w-4" />
            {isSaving ? "Wird gespeichert..." : "Konfiguration speichern"}
          </Button>
        </div>
      )}
    </div>
  )
}
