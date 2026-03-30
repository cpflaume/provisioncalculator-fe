import { useState, useMemo } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PurchaseStats } from "./PurchaseStats"
import { PurchaseTable } from "./PurchaseTable"
import { AddPurchaseForm } from "./AddPurchaseForm"
import { PurchaseImport } from "./PurchaseImport"
import { usePurchases, useSubmitPurchases } from "@/hooks/usePurchases"
import { Send, Upload } from "lucide-react"
import type { PurchaseRequest, SubmitPurchasesRequest, TreeNodeResponse } from "@/api/types"

interface PurchasesPanelProps {
  settlementId: number
  treeNodes: TreeNodeResponse[]
  readOnly: boolean
}

export function PurchasesPanel({ settlementId, treeNodes, readOnly }: PurchasesPanelProps) {
  const [page, setPage] = useState(0)
  const [pendingPurchases, setPendingPurchases] = useState<PurchaseRequest[]>([])
  const { data: purchasesData, isLoading } = usePurchases(settlementId, page)
  const submitMutation = useSubmitPurchases(settlementId)

  const customerIds = useMemo(
    () => treeNodes.map((n) => n.customerId),
    [treeNodes],
  )

  const handleAddPurchase = (purchase: PurchaseRequest) => {
    setPendingPurchases((prev) => [...prev, purchase])
  }

  const handleImport = (data: SubmitPurchasesRequest) => {
    setPendingPurchases((prev) => [...prev, ...data.purchases])
  }

  const handleSubmit = () => {
    if (pendingPurchases.length === 0) return
    submitMutation.mutate(
      { purchases: pendingPurchases },
      { onSuccess: () => setPendingPurchases([]) },
    )
  }

  const totalAmount = purchasesData?.content.reduce((sum, p) => sum + p.amount, 0) ?? 0

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
        totalAmount={totalAmount}
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
              <AddPurchaseForm treeCustomerIds={customerIds} onAdd={handleAddPurchase} />

              {pendingPurchases.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    {pendingPurchases.length} Einkauf/Einkäufe bereit zum Senden
                  </p>
                  <div className="rounded-md border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-500">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">Käufer</th>
                          <th className="px-3 py-2 text-right font-medium">Betrag</th>
                          <th className="px-3 py-2 text-left font-medium">Datum</th>
                          <th className="px-3 py-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingPurchases.map((p, i) => (
                          <tr key={i} className="border-t border-gray-100">
                            <td className="px-3 py-2">{p.buyerCustomerId}</td>
                            <td className="px-3 py-2 text-right">
                              {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(p.amount)}
                            </td>
                            <td className="px-3 py-2">{p.purchasedAt}</td>
                            <td className="px-3 py-2">
                              <button
                                className="text-red-400 hover:text-red-600 text-xs"
                                onClick={() => setPendingPurchases((prev) => prev.filter((_, idx) => idx !== i))}
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
                      <Send className="h-4 w-4" />
                      {submitMutation.isPending ? "Wird gesendet..." : "Einkäufe senden"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        )}

        {!readOnly && (
          <TabsContent value="import">
            <div className="mt-4 space-y-4">
              <PurchaseImport onImport={handleImport} />

              {pendingPurchases.length > 0 && (
                <p className="text-sm text-gray-600">
                  {pendingPurchases.length} Einkauf/Einkäufe in Warteschlange.
                  Wechseln Sie zum Tab "Hinzufügen" um sie zu senden.
                </p>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
