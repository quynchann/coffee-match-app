import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchPage from '@/components/SearchPage'

export const Route = createFileRoute('/search')({
  component: Search,
})

function Search() {
  return (
    <div className="text-center">
      <Header isAuthenticated={true} />
      <SearchPage />
      <Footer />
    </div>
  )
}
