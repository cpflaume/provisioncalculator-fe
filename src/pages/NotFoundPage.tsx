import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-gray-500">Seite nicht gefunden</p>
      <Link to="/" className="mt-4">
        <Button variant="outline">Zurück zum Dashboard</Button>
      </Link>
    </div>
  )
}
