import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchPage from '@/components/SearchPage'
import { z } from 'zod'

// Định nghĩa Schema cho Search Params
const searchSchema = z.object({
  keyword: z.string().optional(), // keyword là tùy chọn
})

export const Route = createFileRoute('/search')({
  // Validate params từ URL
  validateSearch: (search) => searchSchema.parse(search),
  component: Search,
})

function Search() {
  // Lấy keyword từ URL để truyền xuống SearchPage
  const { keyword } = Route.useSearch()

  return (
    <div className="text-center">
      <Header isAuthenticated={true} />
      {/* Truyền keyword xuống component con */}
      <SearchPage initialKeyword={keyword || ''} />
      <Footer />
    </div>
  )
}
