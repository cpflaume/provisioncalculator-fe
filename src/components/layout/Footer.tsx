import { useQuery } from "@tanstack/react-query"
import { fetchBackendVersion } from "@/api/version"

export function Footer() {
  const { data, isError } = useQuery({
    queryKey: ["backend-version"],
    queryFn: fetchBackendVersion,
    staleTime: Infinity,
    retry: false,
  })

  const backendVersion = isError ? "unbekannt" : (data?.version ?? "...")

  return (
    <footer className="h-8 border-t border-gray-200 bg-white px-6 flex items-center justify-end text-xs text-gray-500 gap-4">
      <span>Frontend v{__APP_VERSION__}</span>
      <span>Backend v{backendVersion}</span>
    </footer>
  )
}
