import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface JsonFileImportProps<T> {
  onImport: (data: T) => void
  validate?: (data: unknown) => string | null
  label: string
  description?: string
}

export function JsonFileImport<T>({ onImport, validate, label, description }: JsonFileImportProps<T>) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    (file: File) => {
      setError(null)
      if (!file.name.endsWith(".json")) {
        setError("Bitte eine JSON-Datei auswählen.")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          if (validate) {
            const validationError = validate(data)
            if (validationError) {
              setError(validationError)
              return
            }
          }
          onImport(data as T)
        } catch {
          setError("Ungültiges JSON-Format.")
        }
      }
      reader.readAsText(file)
    },
    [onImport, validate],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile],
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragging ? "border-gray-900 bg-gray-50" : "border-gray-200",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
      >
        <Upload className="h-8 w-8 mx-auto text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">{label}</p>
        {description && <p className="mt-1 text-xs text-gray-400">{description}</p>}
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => fileInputRef.current?.click()}
        >
          Datei auswählen
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) processFile(file)
            e.target.value = ""
          }}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
