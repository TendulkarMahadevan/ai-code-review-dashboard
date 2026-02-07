import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DashboardEnhanced from './pages/DashboardEnhanced'

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
    <QueryClientProvider client={queryClient}>
      <DashboardEnhanced />
    </QueryClientProvider>
  )
}

export default App
