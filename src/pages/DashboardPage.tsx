import { AppShell } from "@/components/layout/AppShell"

export function DashboardPage() {
  return (
    <AppShell>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Abrechnungen</h2>
        <p className="mt-1 text-sm text-gray-500">Alle Abrechnungsperioden im Überblick</p>
      </div>
    </AppShell>
  )
}
