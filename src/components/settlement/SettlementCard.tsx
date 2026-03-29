import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { StatusBadge } from "./StatusBadge"
import { Calendar } from "lucide-react"
import type { Settlement } from "@/api/types"

interface SettlementCardProps {
  settlement: Settlement
}

export function SettlementCard({ settlement }: SettlementCardProps) {
  const navigate = useNavigate()
  const createdDate = new Date(settlement.createdAt).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
      onClick={() => navigate(`/settlements/${settlement.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          navigate(`/settlements/${settlement.id}`)
        }
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{settlement.name}</CardTitle>
          <StatusBadge status={settlement.status} />
        </div>
        <CardDescription className="flex items-center gap-1.5 mt-1">
          <Calendar className="h-3.5 w-3.5" />
          {createdDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-400">ID: {settlement.id}</p>
      </CardContent>
    </Card>
  )
}
