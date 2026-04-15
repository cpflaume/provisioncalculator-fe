import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-14 md:w-60 border-r border-gray-200 bg-white flex flex-col" aria-label="Hauptnavigation">
      <div className="p-4 border-b border-gray-200 flex items-center md:block">
        <h1 className="text-lg font-bold text-gray-900">
          <span className="hidden md:inline">Provisionsrechner</span>
          <span className="md:hidden">P</span>
        </h1>
      </div>
      <nav className="flex-1 p-2 md:p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              title={item.label}
              className={cn(
                "flex items-center justify-center md:justify-start gap-3 p-2 md:px-3 md:py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
