import { useParams, Link } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import { StatusBadge } from "@/components/settlement/StatusBadge"
import { StatusStepper } from "@/components/settlement/StatusStepper"
import { ActionBar } from "@/components/settlement/ActionBar"
import { ConfigPanel } from "@/components/config/ConfigPanel"
import { PurchasesPanel } from "@/components/purchases/PurchasesPanel"
import { ResultsPanel } from "@/components/results/ResultsPanel"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useSettlement, useConfig, useConfigureSettlement, useApprove, useReject } from "@/hooks/useSettlements"
import { usePurchases } from "@/hooks/usePurchases"
import { useCalculate } from "@/hooks/useCalculation"
import { ArrowLeft } from "lucide-react"

export function SettlementPage() {
  const { id } = useParams<{ id: string }>()
  const settlementId = Number(id)
  const { toast } = useToast()

  const { data: settlement, isLoading: loadingSettlement } = useSettlement(settlementId)
  const { data: config } = useConfig(settlementId)
  const configureMutation = useConfigureSettlement(settlementId)
  const { data: purchasesData } = usePurchases(settlementId)
  const calculateMutation = useCalculate(settlementId)
  const approveMutation = useApprove(settlementId)
  const rejectMutation = useReject(settlementId)

  if (loadingSettlement) {
    return (
      <AppShell>
        <div className="space-y-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
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

  const isApproved = settlement.status === "APPROVED"
  const hasConfig = (config?.nodeCount ?? 0) > 0
  const hasPurchases = (purchasesData?.totalElements ?? 0) > 0

  const handleSaveConfig = (request: Parameters<typeof configureMutation.mutate>[0]) => {
    configureMutation.mutate(request, {
      onSuccess: () => toast("Gespeichert", "success"),
      onError: () => toast("Fehler beim Speichern der Konfiguration", "error"),
    })
  }

  const handleCalculate = () => {
    calculateMutation.mutate(undefined, {
      onSuccess: () => toast("Berechnung abgeschlossen", "success"),
    })
  }

  const handleApprove = () => {
    approveMutation.mutate(undefined, {
      onSuccess: () => toast("Abrechnung freigegeben", "success"),
    })
  }

  const handleReject = () => {
    rejectMutation.mutate(undefined, {
      onSuccess: () => toast("Abrechnung abgelehnt", "success"),
    })
  }

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

        {/* Action Bar */}
        <ActionBar
          status={settlement.status}
          onCalculate={handleCalculate}
          onApprove={handleApprove}
          onReject={handleReject}
          isCalculating={calculateMutation.isPending}
          isApproving={approveMutation.isPending}
          isRejecting={rejectMutation.isPending}
        />

        {/* Tabs */}
        <Tabs defaultValue="config">
          <TabsList>
            <TabsTrigger value="config">Konfiguration</TabsTrigger>
            <TabsTrigger value="purchases">Einkäufe</TabsTrigger>
            <TabsTrigger value="results">Ergebnisse</TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            {config ? (
              <ConfigPanel
                config={config}
                onSave={handleSaveConfig}
                readOnly={isApproved}
              />
            ) : (
              <Skeleton className="h-64 w-full mt-4" />
            )}
          </TabsContent>

          <TabsContent value="purchases">
            <PurchasesPanel
              settlementId={settlementId}
              treeNodes={config?.tree ?? []}
              readOnly={isApproved}
            />
          </TabsContent>

          <TabsContent value="results">
            <ResultsPanel
              settlementId={settlementId}
              status={settlement.status}
              treeNodes={config?.tree ?? []}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
