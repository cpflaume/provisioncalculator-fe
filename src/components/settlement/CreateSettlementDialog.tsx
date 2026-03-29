import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CreateSettlementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (name: string) => void
  isLoading: boolean
}

export function CreateSettlementDialog({ open, onOpenChange, onSubmit, isLoading }: CreateSettlementDialogProps) {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
      setName("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neue Abrechnung erstellen</DialogTitle>
          <DialogDescription>
            Geben Sie einen Namen für die Abrechnungsperiode ein, z.B. &quot;März 2026&quot; oder &quot;Q1 2026&quot;.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <label htmlFor="settlement-name" className="text-sm font-medium text-gray-700">
              Name
            </label>
            <Input
              id="settlement-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. März 2026"
              className="mt-1"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={!name.trim() || isLoading}>
              {isLoading ? "Wird erstellt..." : "Erstellen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
