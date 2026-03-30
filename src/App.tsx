import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { TenantContext } from "@/hooks/useTenant"
import { ToastProvider } from "@/components/ui/toast"
import { DashboardPage } from "@/pages/DashboardPage"
import { SettlementPage } from "@/pages/SettlementPage"
import { NotFoundPage } from "@/pages/NotFoundPage"

function App() {
  const [tenantId, setTenantId] = useState("acme")

  return (
    <TenantContext.Provider value={{ tenantId, setTenantId }}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/settlements/:id" element={<SettlementPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </TenantContext.Provider>
  )
}

export default App
