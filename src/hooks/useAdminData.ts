import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as admin from "@/api/admin"

export function useAdminUsers() {
  return useQuery({ queryKey: ["admin", "users"], queryFn: admin.listUsers })
}

export function useAdminTenants() {
  return useQuery({ queryKey: ["admin", "tenants"], queryFn: admin.listTenants })
}

export function useActivateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userId: number) => admin.activateUser(userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  })
}

export function useDisableUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userId: number) => admin.disableUser(userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  })
}

export function useCreateTenant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => admin.createTenant(id, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "tenants"] }),
  })
}

export function useAssignTenant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, tenantId }: { userId: number; tenantId: string }) =>
      admin.assignTenant(userId, tenantId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  })
}

export function useRevokeTenant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, tenantId }: { userId: number; tenantId: string }) =>
      admin.revokeTenant(userId, tenantId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  })
}
