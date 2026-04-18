import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

function dispatchApiError(error: unknown) {
  window.dispatchEvent(
    new CustomEvent("api-error", { detail: error instanceof Error ? error.message : "Ein Fehler ist aufgetreten." })
  )
}

const mutationCache = new MutationCache({
  onError: dispatchApiError,
})

const queryCache = new QueryCache({
  onError: dispatchApiError,
})

const queryClient = new QueryClient({
  mutationCache,
  queryCache,
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
