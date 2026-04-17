import { rawGet, rawPost, rawDelete } from "./client"

export interface AdminUser {
  userId: number
  email: string
  displayName: string
  role: "ADMIN" | "USER"
  status: "PENDING" | "ACTIVE" | "DISABLED"
  tenantIds: string[]
}

export interface AdminTenant {
  id: string
  name: string
}

export function listUsers(): Promise<AdminUser[]> {
  return rawGet<AdminUser[]>("/api/admin/users")
}

export function activateUser(userId: number): Promise<AdminUser> {
  return rawPost<AdminUser>(`/api/admin/users/${userId}/activate`)
}

export function disableUser(userId: number): Promise<AdminUser> {
  return rawPost<AdminUser>(`/api/admin/users/${userId}/disable`)
}

export function listTenants(): Promise<AdminTenant[]> {
  return rawGet<AdminTenant[]>("/api/admin/tenants")
}

export function createTenant(id: string, name: string): Promise<AdminTenant> {
  return rawPost<AdminTenant>("/api/admin/tenants", { id, name })
}

export function assignTenant(userId: number, tenantId: string): Promise<void> {
  return rawPost<void>(`/api/admin/users/${userId}/tenants/${tenantId}`)
}

export function revokeTenant(userId: number, tenantId: string): Promise<void> {
  return rawDelete<void>(`/api/admin/users/${userId}/tenants/${tenantId}`)
}
