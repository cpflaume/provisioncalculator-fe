import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

export function RequireAuth() {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.status === "PENDING") return <Navigate to="/pending" replace />

  return <Outlet />
}
