import { BrowserRouter, Routes, Route } from "react-router-dom"
import { DashboardPage } from "@/pages/DashboardPage"
import { SettlementPage } from "@/pages/SettlementPage"
import { NotFoundPage } from "@/pages/NotFoundPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/settlements/:id" element={<SettlementPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
