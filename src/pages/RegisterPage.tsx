import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError("Das Passwort muss mindestens 8 Zeichen lang sein.")
      return
    }
    setError("")
    setLoading(true)
    try {
      await register(email, password, displayName)
      navigate("/pending")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrierung fehlgeschlagen")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Konto erstellen</h1>
        <p className="text-sm text-gray-500 mb-6">
          Nach der Registrierung wird Ihr Konto von einem Administrator freigeschaltet.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <Input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Max Mustermann"
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="max@beispiel.de"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passwort <span className="text-gray-400">(min. 8 Zeichen)</span>
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Wird registriert..." : "Registrieren"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-gray-500 text-center">
          Bereits registriert?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  )
}
