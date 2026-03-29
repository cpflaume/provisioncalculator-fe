import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-60 border-r border-gray-200 bg-white flex flex-col" aria-label="Hauptnavigation">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">Provisionsrechner</h1>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
