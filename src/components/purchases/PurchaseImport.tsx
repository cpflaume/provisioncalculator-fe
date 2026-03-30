import { JsonFileImport } from "@/components/common/JsonFileImport"
import type { SubmitPurchasesRequest } from "@/api/types"

interface PurchaseImportProps {
  onImport: (data: SubmitPurchasesRequest) => void
}

function validatePurchases(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return "Ungültiges Format."
  const obj = data as Record<string, unknown>
  if (!Array.isArray(obj.purchases)) return "Feld 'purchases' fehlt oder ist kein Array."

  for (let i = 0; i < obj.purchases.length; i++) {
    const p = obj.purchases[i] as Record<string, unknown>
    if (typeof p.buyerCustomerId !== "string" || p.buyerCustomerId.trim() === "") {
      return `Einkauf ${i + 1}: 'buyerCustomerId' fehlt oder ist leer.`
    }
    if (typeof p.amount !== "number" || p.amount <= 0) {
      return `Einkauf ${i + 1}: 'amount' muss eine positive Zahl sein.`
    }
    if (typeof p.purchasedAt !== "string" || p.purchasedAt.trim() === "") {
      return `Einkauf ${i + 1}: 'purchasedAt' fehlt oder ist leer.`
    }
  }

  return null
}

export function PurchaseImport({ onImport }: PurchaseImportProps) {
  return (
    <JsonFileImport<SubmitPurchasesRequest>
      onImport={onImport}
      validate={validatePurchases}
      label="JSON-Datei mit Einkäufen hierher ziehen"
      description={'Format: { "purchases": [{ "buyerCustomerId": "...", "amount": 100, "purchasedAt": "..." }] }'}
    />
  )
}
