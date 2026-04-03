import { useState } from "react"
import { AppShell } from "@/components/layout/AppShell"
import { Button } from "@/components/ui/button"
import { SkeletonCard } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { SettlementCard } from "@/components/settlement/SettlementCard"
import { CreateSettlementDialog } from "@/components/settlement/CreateSettlementDialog"
import { useSettlements, useCreateSettlement } from "@/hooks/useSettlements"
import { Plus } from "lucide-react"
import type { SettlementStatus } from "@/api/types"

const statusFilters: { label: string; value: SettlementStatus | undefined }[] = [
  { label: "Alle", value: undefined },
  { label: "Offen", value: "OPEN" },
  { label: "Berechnet", value: "CALCULATED" },
  { label: "Freigegeben", value: "APPROVED" },
]

export function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState<SettlementStatus | undefined>(undefined)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { toast } = useToast()
  const { data: settlements, isLoading, error } = useSettlements(statusFilter)
  const createMutation = useCreateSettlement()

  const handleCreate = (name: string) => {
    createMutation.mutate(
      { name },
      {
        onSuccess: () => {
          setDialogOpen(false)
          toast("Abrechnung erstellt", "success")
        },
      },
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Abrechnungen</h2>
            <p className="mt-1 text-sm text-gray-500">Alle Abrechnungsperioden im Überblick</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Neue Abrechnung
          </Button>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {statusFilters.map((filter) => (
            <Button
              key={filter.label}
              variant={statusFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            Fehler beim Laden: {error instanceof Error ? error.message : "Unbekannter Fehler"}
          </div>
        )}

        {settlements && settlements.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">Keine Abrechnungen gefunden</p>
            <p className="mt-1 text-sm">Erstellen Sie eine neue Abrechnung, um zu beginnen.</p>
          </div>
        )}

        {settlements && settlements.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settlements.map((settlement) => (
              <SettlementCard key={settlement.id} settlement={settlement} />
            ))}
          </div>
        )}
      </div>

      <CreateSettlementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />
    </AppShell>
  )
}
