import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import type { PurchaseRequest } from "@/api/types"

interface AddPurchaseFormProps {
  treeCustomerIds: string[]
  onAdd: (purchase: PurchaseRequest) => void
}

export function AddPurchaseForm({ treeCustomerIds, onAdd }: AddPurchaseFormProps) {
  const [buyerId, setBuyerId] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredIds = buyerId
    ? treeCustomerIds.filter((id) => id.toLowerCase().includes(buyerId.toLowerCase()))
    : treeCustomerIds

  const isValid = buyerId.trim() !== "" && Number(amount) > 0 && date !== ""

  const handleSubmit = () => {
    if (!isValid) return
    onAdd({
      buyerCustomerId: buyerId.trim(),
      amount: Number(amount),
      purchasedAt: new Date(date).toISOString().replace("Z", ""),
    })
    setBuyerId("")
    setAmount("")
    setDate("")
  }

  return (
    <div className="rounded-md border border-gray-200 p-4 space-y-3">
      <p className="text-sm font-medium text-gray-700">Einkauf hinzufügen</p>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <div className="relative">
          <label className="text-xs text-gray-500 mb-1 block">Käufer-ID</label>
          <Input
            value={buyerId}
            onChange={(e) => setBuyerId(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="z.B. Customer-A"
          />
          {showSuggestions && filteredIds.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full max-h-40 overflow-auto rounded-md border border-gray-200 bg-white shadow-md">
              {filteredIds.map((id) => (
                <li
                  key={id}
                  className="cursor-pointer px-3 py-1.5 text-sm hover:bg-gray-100"
                  onMouseDown={() => {
                    setBuyerId(id)
                    setShowSuggestions(false)
                  }}
                >
                  {id}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Betrag (€)</label>
          <Input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Kaufdatum</label>
          <Input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <Button onClick={handleSubmit} disabled={!isValid}>
          <Plus className="h-4 w-4" />
          Hinzufügen
        </Button>
      </div>
    </div>
  )
}
