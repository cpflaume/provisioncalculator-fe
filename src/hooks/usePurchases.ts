import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTenant } from "./useTenant"
import { getPurchases, submitPurchases } from "@/api/purchases"
import type { SubmitPurchasesRequest } from "@/api/types"

export function usePurchases(settlementId: number, page = 0, size = 20) {
  const { tenantId } = useTenant()
  return useQuery({
    queryKey: ["purchases", tenantId, settlementId, page, size],
    queryFn: () => getPurchases(tenantId, settlementId, page, size),
  })
}

export function useSubmitPurchases(settlementId: number) {
  const { tenantId } = useTenant()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: SubmitPurchasesRequest) =>
      submitPurchases(tenantId, settlementId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases", tenantId, settlementId] })
      queryClient.invalidateQueries({ queryKey: ["tenant-overview", tenantId] })
      queryClient.invalidateQueries({ queryKey: ["settlement-metrics", tenantId, settlementId] })
    },
  })
}
