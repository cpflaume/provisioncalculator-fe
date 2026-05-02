import type { ReactNode } from "react"
import { Sidebar } from "./Sidebar"
import { SwaggerLink } from "./SwaggerLink"
import { TenantSelector } from "./TenantSelector"

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-end gap-4 px-6">
          <SwaggerLink />
          <TenantSelector />
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
