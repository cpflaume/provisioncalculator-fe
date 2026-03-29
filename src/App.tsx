import { BrowserRouter, Routes, Route } from "react-router-dom"
import { DashboardPage } from "@/pages/DashboardPage"
import { SettlementPage } from "@/pages/SettlementPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/settlements/:id" element={<SettlementPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
