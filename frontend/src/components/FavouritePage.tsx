import { useState } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import CafeCard from './cafe/CafeCard'
import PaginationButton from './pagination/PaginationButtonProps'
import type { Cafe } from '@/types/cafe'
import cafeDataRaw from '@/data/cafes.json'

const FavoritePage = () => {
  const CAFES_DATA: Array<Cafe> = cafeDataRaw as Array<Cafe>
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10
  const totalItems = cafeDataRaw.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1

  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((curr) => curr - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((curr) => curr + 1)
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col font-sans w-full">
      <div className="w-full flex flex-col md:flex-row gap-8 p-4 md:px-8 md:py-8 relative">
        <main className="flex-1">
          <div className="flex justify-center mb-8">
            <div className="bg-[#FF6347] text-white  px-12 py-3 rounded text-xl font-bold shadow-sm text-center relative">
              お気に入りのカフェ
            </div>
          </div>

          {cafeDataRaw.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
              {cafeDataRaw.map((item) => (
                <CafeCard
                  key={item.id}
                  data={item}
                  userLocation={userLocation}
                  showDistance={true}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
              <Search size={48} className="mb-4 text-gray-300" />
              <p className="text-lg font-bold">
                適切なカフェが見つかりませんでした。
              </p>
              <p className="text-sm">
                フィルターやキーワードを変更してお試しください。
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mb-8 mt-8 select-none">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationButton
                    key={page}
                    active={currentPage === page}
                    onClick={() => handlePageClick(page)}>
                    {page}
                  </PaginationButton>
                ),
              )}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default FavoritePage
