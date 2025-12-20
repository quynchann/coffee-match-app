import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchPage from '@/components/SearchPage'

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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Truyền keyword xuống component con */}
        <SearchPage initialKeyword={keyword || ''} />
      </main>
      <Footer />
    </div>
  )
}
