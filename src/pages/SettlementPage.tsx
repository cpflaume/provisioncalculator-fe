import { useParams } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"

export function SettlementPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <AppShell>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Abrechnung #{id}</h2>
      </div>
    </AppShell>
  )
}
