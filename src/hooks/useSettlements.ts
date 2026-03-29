import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTenant } from "./useTenant"
import { getSettlements, getSettlement, createSettlement, getConfig, configureSettlement, approveSettlement, rejectSettlement } from "@/api/settlements"
import type { SettlementStatus, CreateSettlementRequest, ConfigureSettingsRequest } from "@/api/types"

export function useSettlements(status?: SettlementStatus) {
  const { tenantId } = useTenant()
  return useQuery({
    queryKey: ["settlements", tenantId, status],
    queryFn: () => getSettlements(tenantId, status),
  })
}

export function useSettlement(settlementId: number) {
  const { tenantId } = useTenant()
  return useQuery({
    queryKey: ["settlement", tenantId, settlementId],
    queryFn: () => getSettlement(tenantId, settlementId),
  })
}

export function useConfig(settlementId: number) {
  const { tenantId } = useTenant()
  return useQuery({
    queryKey: ["config", tenantId, settlementId],
    queryFn: () => getConfig(tenantId, settlementId),
  })
}

export function useCreateSettlement() {
  const { tenantId } = useTenant()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CreateSettlementRequest) => createSettlement(tenantId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settlements", tenantId] })
    },
  })
}

export function useConfigureSettlement(settlementId: number) {
  const { tenantId } = useTenant()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: ConfigureSettingsRequest) => configureSettlement(tenantId, settlementId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settlement", tenantId, settlementId] })
      queryClient.invalidateQueries({ queryKey: ["config", tenantId, settlementId] })
    },
  })
}

export function useApprove(settlementId: number) {
  const { tenantId } = useTenant()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => approveSettlement(tenantId, settlementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settlement", tenantId, settlementId] })
      queryClient.invalidateQueries({ queryKey: ["settlements", tenantId] })
    },
  })
}

export function useReject(settlementId: number) {
  const { tenantId } = useTenant()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => rejectSettlement(tenantId, settlementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settlement", tenantId, settlementId] })
      queryClient.invalidateQueries({ queryKey: ["settlements", tenantId] })
    },
  })
}
