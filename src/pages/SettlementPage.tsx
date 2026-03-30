import { useParams, Link } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import { StatusBadge } from "@/components/settlement/StatusBadge"
import { StatusStepper } from "@/components/settlement/StatusStepper"
import { ConfigPanel } from "@/components/config/ConfigPanel"
import { PurchasesPanel } from "@/components/purchases/PurchasesPanel"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useSettlement, useConfig, useConfigureSettlement } from "@/hooks/useSettlements"
import { usePurchases } from "@/hooks/usePurchases"
import { ArrowLeft } from "lucide-react"

export function SettlementPage() {
  const { id } = useParams<{ id: string }>()
  const settlementId = Number(id)

  const { data: settlement, isLoading: loadingSettlement } = useSettlement(settlementId)
  const { data: config } = useConfig(settlementId)
  const configureMutation = useConfigureSettlement(settlementId)

  if (loadingSettlement) {
    return (
      <AppShell>
        <div className="text-sm text-gray-500">Lade Abrechnung...</div>
      </AppShell>
    )
  }

  if (!settlement) {
    return (
      <AppShell>
        <div className="text-sm text-red-500">Abrechnung nicht gefunden.</div>
      </AppShell>
    )
  }

  const { data: purchasesData } = usePurchases(settlementId)
  const isApproved = settlement.status === "APPROVED"
  const hasConfig = (config?.nodeCount ?? 0) > 0
  const hasPurchases = (purchasesData?.totalElements ?? 0) > 0

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3">
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Link>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{settlement.name}</h2>
            <StatusBadge status={settlement.status} />
          </div>
        </div>

        {/* Stepper */}
        <StatusStepper
          status={settlement.status}
          hasConfig={hasConfig}
          hasPurchases={hasPurchases}
        />

        {/* Tabs */}
        <Tabs defaultValue="config">
          <TabsList>
            <TabsTrigger value="config">Konfiguration</TabsTrigger>
            <TabsTrigger value="purchases">Einkäufe</TabsTrigger>
            <TabsTrigger value="results">Ergebnisse</TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <ConfigPanel
              config={config}
              onSave={(request) => configureMutation.mutate(request)}
              isSaving={configureMutation.isPending}
              readOnly={isApproved}
            />
          </TabsContent>

          <TabsContent value="purchases">
            <PurchasesPanel
              settlementId={settlementId}
              treeNodes={config?.tree ?? []}
              readOnly={isApproved}
            />
          </TabsContent>

          <TabsContent value="results">
            <div className="mt-4 text-sm text-gray-400">Ergebnisse werden in Phase 5 implementiert.</div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
