import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTenant } from "./useTenant"
import { calculate, getCalculation, getRecipientDetail, getAuditTrail } from "@/api/calculations"

export function useCalculation(settlementId: number, enabled = true) {
  const { tenantId } = useTenant()
  return useQuery({
    queryKey: ["calculation", tenantId, settlementId],
    queryFn: () => getCalculation(tenantId, settlementId),
    enabled,
  })
}

export function useRecipientDetail(settlementId: number, customerId: string | null) {
  const { tenantId } = useTenant()
  return useQuery({
    queryKey: ["recipientDetail", tenantId, settlementId, customerId],
    queryFn: () => getRecipientDetail(tenantId, settlementId, customerId!),
    enabled: customerId !== null,
  })
}

export function useAuditTrail(settlementId: number, enabled = true) {
  const { tenantId } = useTenant()
  return useQuery({
    queryKey: ["audit", tenantId, settlementId],
    queryFn: () => getAuditTrail(tenantId, settlementId),
    enabled,
  })
}

export function useCalculate(settlementId: number) {
  const { tenantId } = useTenant()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => calculate(tenantId, settlementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calculation", tenantId, settlementId] })
      queryClient.invalidateQueries({ queryKey: ["settlement", tenantId, settlementId] })
      queryClient.invalidateQueries({ queryKey: ["settlements", tenantId] })
      queryClient.invalidateQueries({ queryKey: ["tenant-overview", tenantId] })
      queryClient.invalidateQueries({ queryKey: ["settlement-metrics", tenantId, settlementId] })
    },
  })
}
