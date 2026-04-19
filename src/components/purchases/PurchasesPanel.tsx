import { useState, useMemo, useRef } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PurchaseStats } from "./PurchaseStats"
import { PurchaseTable } from "./PurchaseTable"
import { AddPurchaseForm } from "./AddPurchaseForm"
import { PurchaseImport } from "./PurchaseImport"
import { usePurchases, useSubmitPurchases } from "@/hooks/usePurchases"
import { useToast } from "@/components/ui/use-toast"
import { Upload } from "lucide-react"
import type { PurchaseRequest, SubmitPurchasesRequest, TreeNodeResponse } from "@/api/types"

interface RecentPurchase {
  id: number
  purchase: PurchaseRequest
  fading: boolean
}

interface PurchasesPanelProps {
  settlementId: number
  treeNodes: TreeNodeResponse[]
  readOnly: boolean
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value)
}

export function PurchasesPanel({ settlementId, treeNodes, readOnly }: PurchasesPanelProps) {
  const [page, setPage] = useState(0)
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchase[]>([])
  const nextId = useRef(0)
  const { data: purchasesData, isLoading } = usePurchases(settlementId, page)
  const submitMutation = useSubmitPurchases(settlementId)
  const { toast } = useToast()

  const customerIds = useMemo(
    () => treeNodes.map((n) => n.customerId),
    [treeNodes],
  )

  const addRecent = (purchase: PurchaseRequest) => {
    const id = nextId.current++
    setRecentPurchases((prev) => [...prev, { id, purchase, fading: false }])
    setTimeout(() => {
      setRecentPurchases((prev) =>
        prev.map((p) => (p.id === id ? { ...p, fading: true } : p))
      )
    }, 55_000)
    setTimeout(() => {
      setRecentPurchases((prev) => prev.filter((p) => p.id !== id))
    }, 60_000)
  }

  const handleAddPurchase = (purchase: PurchaseRequest) => {
    submitMutation.mutate(
      { purchases: [purchase] },
      {
        onSuccess: () => {
          addRecent(purchase)
          toast("Einkauf gespeichert", "success")
        },
      },
    )
  }

  const handleImport = (data: SubmitPurchasesRequest) => {
    submitMutation.mutate(data, {
      onSuccess: (result) => {
        toast(`${result.accepted} Einkäufe importiert`, "success")
      },
    })
  }

  const pageTotal = purchasesData?.content.reduce((sum, p) => sum + p.amount, 0) ?? 0

  if (isLoading) {
    return <div className="mt-4 text-sm text-gray-500">Lade Einkäufe...</div>
  }

  return (
    <div className="space-y-6 mt-4">
      {readOnly && (
        <div className="rounded-md bg-gray-100 px-4 py-3 text-sm text-gray-600">
          Diese Abrechnung ist freigegeben. Einkäufe können nicht mehr geändert werden.
        </div>
      )}

      <PurchaseStats
        totalCount={purchasesData?.totalElements ?? 0}
        totalAmount={pageTotal}
      />

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Übersicht</TabsTrigger>
          {!readOnly && <TabsTrigger value="add">Hinzufügen</TabsTrigger>}
          {!readOnly && (
            <TabsTrigger value="import">
              <Upload className="h-3.5 w-3.5 mr-1.5" />Import
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="list">
          <div className="mt-4">
            <PurchaseTable
              purchases={purchasesData?.content ?? []}
              page={page}
              totalPages={purchasesData?.totalPages ?? 0}
              onPageChange={setPage}
            />
          </div>
        </TabsContent>

        {!readOnly && (
          <TabsContent value="add">
            <div className="mt-4 space-y-4">
              <AddPurchaseForm
                treeCustomerIds={customerIds}
                onAdd={handleAddPurchase}
                isSaving={submitMutation.isPending}
              />
              {recentPurchases.length > 0 && (
                <div className="rounded-md border border-gray-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">Käufer</th>
                        <th className="px-3 py-2 text-right font-medium">Betrag</th>
                        <th className="px-3 py-2 text-left font-medium">Datum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPurchases.map((r) => (
                        <tr
                          key={r.id}
                          className="border-t border-gray-100 transition-opacity duration-[5000ms]"
                          style={{ opacity: r.fading ? 0 : 1 }}
                        >
                          <td className="px-3 py-2">{r.purchase.buyerCustomerId}</td>
                          <td className="px-3 py-2 text-right">{formatCurrency(r.purchase.amount)}</td>
                          <td className="px-3 py-2">{r.purchase.purchasedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
        )}

        {!readOnly && (
          <TabsContent value="import">
            <div className="mt-4">
              <PurchaseImport onImport={handleImport} />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
