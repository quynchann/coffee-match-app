import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HistoryPage from '@/components/HistoryPage'

export const Route = createFileRoute('/history')({
  component: History,
})

function History() {
  return (
    <div className="text-center">
      <Header isAuthenticated={true} />
      <HistoryPage />
      <Footer />
    </div>
  )
}
