import { JsonFileImport } from "@/components/common/JsonFileImport"
import { Button } from "@/components/ui/button"
import { smallTreeConfig, largeTreeConfig } from "@/data/sampleData"
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
    <div className="space-y-4">
      <JsonFileImport<ConfigureSettingsRequest>
        onImport={onImport}
        validate={validateConfig}
        label="JSON-Datei mit Konfiguration hierher ziehen"
        description={'Format: { "rates": [...], "tree": [...] }'}
      />
      <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-600 mb-3">Oder Beispieldaten direkt übernehmen:</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={() => onImport(smallTreeConfig)}>
            Kleines Beispiel (5 Knoten, Tiefe 3)
          </Button>
          <Button variant="outline" size="sm" onClick={() => onImport(largeTreeConfig)}>
            Großes Beispiel (500 Knoten, Tiefe 20)
          </Button>
        </div>
      </div>
    </div>
  )
}
