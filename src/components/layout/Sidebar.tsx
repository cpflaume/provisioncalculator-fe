import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, PanelLeftOpen, PanelLeftClose } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
]

export function Sidebar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const expanded = mobileOpen

  return (
    <>
      {/* Backdrop when sidebar is open on mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "border-r border-gray-200 bg-white flex flex-col z-40",
          "md:relative md:w-60",
          mobileOpen
            ? "fixed inset-y-0 left-0 w-60"
            : "w-14",
        )}
        aria-label="Hauptnavigation"
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className={cn("text-lg font-bold text-gray-900", !expanded && "md:hidden")}>
            <span className={cn(expanded ? "inline" : "hidden", "md:inline")}>Provisionsrechner</span>
            <span className={cn(expanded ? "hidden" : "inline", "md:hidden")}>P</span>
          </h1>
        </div>
        <nav className={cn("flex-1 space-y-1", expanded ? "p-3" : "p-2 md:p-3")}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                title={item.label}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md text-sm font-medium transition-colors",
                  expanded
                    ? "justify-start px-3 py-2"
                    : "justify-center p-2 md:justify-start md:px-3 md:py-2",
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className={cn(expanded ? "inline" : "hidden", "md:inline")}>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className={cn("border-t border-gray-200 flex items-center", expanded ? "p-4 justify-end" : "p-2 justify-center md:p-4 md:justify-end")}>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label={mobileOpen ? "Navigation einklappen" : "Navigation ausklappen"}
          >
            {mobileOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </button>
        </div>
      </aside>
    </>
  )
}
