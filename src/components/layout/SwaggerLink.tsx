import { BookOpen } from "lucide-react"
import type { MouseEvent } from "react"

const API_BASE = import.meta.env.VITE_API_BASE_URL || ""

export function SwaggerLink() {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const token = localStorage.getItem("auth_token")
    const url = token
      ? `${API_BASE}/swagger-ui-auth#token=${encodeURIComponent(token)}`
      : `${API_BASE}/swagger-ui.html`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <a
      href={`${API_BASE}/swagger-ui.html`}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      title="API-Dokumentation"
      className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
    >
      <BookOpen className="h-4 w-4" />
      <span>API</span>
    </a>
  )
}
