import { useParams } from "react-router-dom"

export function SettlementPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-gray-900">Abrechnung #{id}</h1>
    </div>
  )
}
