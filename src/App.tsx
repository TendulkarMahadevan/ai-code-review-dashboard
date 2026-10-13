import { Suspense, lazy } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SkeletonCard } from './components/Skeleton/Skeleton'

const DashboardEnhanced = lazy(() => import('./pages/DashboardEnhanced'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<SkeletonCard />}>
          <DashboardEnhanced />
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
