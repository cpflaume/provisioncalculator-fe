import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

const mutationCache = new MutationCache({
  onError: (error) => {
    // Global mutation error handler — dispatches a custom event
    // that the ToastProvider listens to
    window.dispatchEvent(
      new CustomEvent("api-error", { detail: error instanceof Error ? error.message : "Ein Fehler ist aufgetreten." })
    )
  },
})

const queryClient = new QueryClient({
  mutationCache,
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
