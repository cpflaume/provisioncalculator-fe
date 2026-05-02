import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LoginPage() {
  const { login, loginAsDemo } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Anmeldung fehlgeschlagen")
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = async () => {
    setError("")
    setDemoLoading(true)
    try {
      await loginAsDemo()
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo-Konto konnte nicht erstellt werden")
    } finally {
      setDemoLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Provisionsrechner</h1>
        <p className="text-sm text-gray-500 mb-6">Bitte melden Sie sich an, um fortzufahren.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="max@beispiel.de"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading || demoLoading}>
            {loading ? "Wird angemeldet..." : "Anmelden"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs uppercase tracking-wide text-gray-400">oder</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={loading || demoLoading}
          onClick={handleDemo}
        >
          {demoLoading ? "Demo wird vorbereitet..." : "Demo ausprobieren"}
        </Button>
        <p className="mt-2 text-xs text-gray-500 text-center">
          Temporäres Konto, automatisch gelöscht nach 24 Stunden.
        </p>

        <p className="mt-6 text-sm text-gray-500 text-center">
          Noch kein Konto?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Registrieren
          </Link>
        </p>
      </div>
    </div>
  )
}
