import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SettlementStatus } from "@/api/types"

interface Step {
  label: string
  key: string
}

const steps: Step[] = [
  { label: "Konfiguration", key: "config" },
  { label: "Einkäufe", key: "purchases" },
  { label: "Berechnung", key: "calculation" },
  { label: "Freigabe", key: "approval" },
]

function getActiveStep(status: SettlementStatus, hasConfig: boolean, hasPurchases: boolean): number {
  if (status === "APPROVED") return 4
  if (status === "CALCULATED") return 3
  if (hasPurchases) return 2
  if (hasConfig) return 1
  return 0
}

interface StatusStepperProps {
  status: SettlementStatus
  hasConfig: boolean
  hasPurchases: boolean
}

export function StatusStepper({ status, hasConfig, hasPurchases }: StatusStepperProps) {
  const activeStep = getActiveStep(status, hasConfig, hasPurchases)

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const isComplete = index < activeStep
        const isCurrent = index === activeStep
        return (
          <div key={step.key} className="flex items-center gap-2">
            {index > 0 && (
              <div className={cn("h-px w-8", isComplete ? "bg-gray-900" : "bg-gray-200")} />
            )}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
                  isComplete && "bg-gray-900 text-white",
                  isCurrent && "border-2 border-gray-900 text-gray-900",
                  !isComplete && !isCurrent && "border border-gray-300 text-gray-400",
                )}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </div>
              <span
                className={cn(
                  "text-sm",
                  isComplete || isCurrent ? "font-medium text-gray-900" : "text-gray-400",
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
