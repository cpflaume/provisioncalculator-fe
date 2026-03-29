import { JsonFileImport } from "@/components/common/JsonFileImport"
import type { ConfigureSettingsRequest } from "@/api/types"

interface TreeImportProps {
  onImport: (data: ConfigureSettingsRequest) => void
}

function validateConfig(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return "Ungültiges Format."
  const obj = data as Record<string, unknown>
  if (!Array.isArray(obj.rates)) return "Feld 'rates' fehlt oder ist kein Array."
  if (!Array.isArray(obj.tree)) return "Feld 'tree' fehlt oder ist kein Array."

  for (const rate of obj.rates) {
    const r = rate as Record<string, unknown>
    if (typeof r.depth !== "number" || typeof r.ratePercent !== "number") {
      return "Jeder Eintrag in 'rates' braucht 'depth' (Zahl) und 'ratePercent' (Zahl)."
    }
  }

  const customerIds = new Set<string>()
  for (const node of obj.tree) {
    const n = node as Record<string, unknown>
    if (typeof n.customerId !== "string") return "Jeder Eintrag in 'tree' braucht 'customerId' (String)."
    if (customerIds.has(n.customerId)) return `Doppelte Kunden-ID: '${n.customerId}'.`
    customerIds.add(n.customerId)
  }

  return null
}

export function TreeImport({ onImport }: TreeImportProps) {
  return (
    <JsonFileImport<ConfigureSettingsRequest>
      onImport={onImport}
      validate={validateConfig}
      label="JSON-Datei mit Konfiguration hierher ziehen"
      description={'Format: { "rates": [...], "tree": [...] }'}
    />
  )
}
