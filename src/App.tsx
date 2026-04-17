import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { TenantContext } from "@/hooks/useTenant"
import { ToastProvider } from "@/components/ui/toast"
import { AuthProvider } from "@/context/AuthContext"
import { useAuth } from "@/hooks/useAuth"
import { RequireAuth } from "@/components/auth/RequireAuth"
import { RequireAdmin } from "@/components/auth/RequireAdmin"
import { DashboardPage } from "@/pages/DashboardPage"
import { SettlementPage } from "@/pages/SettlementPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { LoginPage } from "@/pages/LoginPage"
import { RegisterPage } from "@/pages/RegisterPage"
import { PendingApprovalPage } from "@/pages/PendingApprovalPage"
import { AdminPage } from "@/pages/AdminPage"

function AuthenticatedApp() {
  const { user } = useAuth()
  const [selectedTenant, setSelectedTenant] = useState("")
  // Derive active tenant: respect manual selection only if user still has that tenant
  const tenantId =
    selectedTenant && user?.tenantIds.includes(selectedTenant)
      ? selectedTenant
      : (user?.tenantIds[0] ?? "")

  return (
    <TenantContext.Provider value={{ tenantId, setTenantId: setSelectedTenant }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pending" element={<PendingApprovalPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/settlements/:id" element={<SettlementPage />} />
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </TenantContext.Provider>
  )
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AuthenticatedApp />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
