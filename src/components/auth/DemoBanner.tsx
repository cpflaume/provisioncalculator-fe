import { useAuth } from "@/hooks/useAuth"

function formatRemaining(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now()
  if (ms <= 0) return "abgelaufen"
  const hours = Math.floor(ms / 3_600_000)
  const minutes = Math.floor((ms % 3_600_000) / 60_000)
  if (hours > 0) return `${hours} h ${minutes} min`
  return `${minutes} min`
}

export function DemoBanner() {
  const { user } = useAuth()
  if (!user || user.authProvider !== "DEMO") return null

  const remaining = user.expiresAt ? formatRemaining(user.expiresAt) : null

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-900 text-center">
      <span className="font-medium">Demo-Konto</span>
      {" — "}
      Alle Daten werden automatisch gelöscht
      {remaining ? ` (in ${remaining})` : " nach 24 Stunden"}.
    </div>
  )
}
