import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ResultsSummary } from "./ResultsSummary"
import { RecipientTable } from "./RecipientTable"
import { RecipientDetail } from "./RecipientDetail"
import { CommissionTreeView } from "./CommissionTreeView"
import { AuditTrail } from "./AuditTrail"
import { useCalculation } from "@/hooks/useCalculation"
import type { SettlementStatus, TreeNodeResponse } from "@/api/types"

interface ResultsPanelProps {
  settlementId: number
  status: SettlementStatus
  treeNodes: TreeNodeResponse[]
}

export function ResultsPanel({ settlementId, status, treeNodes }: ResultsPanelProps) {
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null)
  const isCalculated = status === "CALCULATED" || status === "APPROVED"
  const { data: calculation, isLoading } = useCalculation(settlementId, isCalculated)

  if (!isCalculated) {
    return (
      <div className="mt-4 rounded-md border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
        Bitte zuerst die Berechnung durchführen, um Ergebnisse zu sehen.
      </div>
    )
  }

  if (isLoading) {
    return <div className="mt-4 text-sm text-gray-500">Lade Ergebnisse...</div>
  }

  if (!calculation) {
    return <div className="mt-4 text-sm text-gray-400">Keine Ergebnisse verfügbar.</div>
  }

  return (
    <div className="space-y-6 mt-4">
      <ResultsSummary results={calculation.results} calculatedAt={calculation.calculatedAt} />

      <Tabs defaultValue="recipients">
        <TabsList>
          <TabsTrigger value="recipients">Empfänger</TabsTrigger>
          <TabsTrigger value="tree">Provisionsbaum</TabsTrigger>
          <TabsTrigger value="audit">Audit-Log</TabsTrigger>
        </TabsList>

        <TabsContent value="recipients">
          <div className="mt-4 space-y-4">
            <RecipientTable
              results={calculation.results}
              onSelect={setSelectedRecipient}
              selectedId={selectedRecipient}
            />
            {selectedRecipient && (
              <RecipientDetail
                settlementId={settlementId}
                customerId={selectedRecipient}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="tree">
          <div className="mt-4">
            <CommissionTreeView treeNodes={treeNodes} results={calculation.results} />
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <div className="mt-4">
            <AuditTrail settlementId={settlementId} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
