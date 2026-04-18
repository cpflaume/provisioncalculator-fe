import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"

export function PendingApprovalPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 p-8 shadow-sm text-center">
        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Konto wird geprüft</h1>
        <p className="text-gray-500 mb-2">
          Hallo{user?.displayName ? ` ${user.displayName}` : ""},
        </p>
        <p className="text-gray-500 mb-6">
          Ihr Konto wurde erfolgreich erstellt und wartet auf die Freischaltung durch einen Administrator.
          Sie erhalten Zugang, sobald Ihr Konto aktiviert wurde.
        </p>
        <Button variant="outline" onClick={handleLogout} className="w-full">
          Abmelden
        </Button>
      </div>
    </div>
  )
}
