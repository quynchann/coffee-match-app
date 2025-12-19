import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import CafeCard from "../cafe/CafeCard"
import PaginationButton from "../pagination/PaginationButtonProps"
import type { Cafe } from "@/types/cafe"

interface MainContentProps {
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  cafes: Array<Cafe>
  totalItems: number
  sortBy: 'default' | 'distance' | 'rating'
  onSortChange: (sort: 'default' | 'distance' | 'rating') => void
  userLocation: { lat: number; lng: number } | null
  showDistance: boolean
}

const MainContent: React.FC<MainContentProps> = ({
  currentPage,
  setCurrentPage,
  cafes,
  totalItems,
  sortBy,
  onSortChange,
  userLocation,
  showDistance,
}) => {
  const ITEMS_PER_PAGE = 10
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1

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
    <main className="flex-1">
      <div className="flex justify-center mb-8">
        <div className="bg-[#666] text-white px-12 py-3 rounded text-xl font-bold shadow-sm text-center relative">
          カフェ検索結果
        </div>
      </div>

      <div className="bg-[#D9D9D9] p-3 rounded mb-6 flex flex-col sm:flex-row items-center justify-between sm:justify-start gap-4 sm:gap-0">
        <span className="font-bold text-gray-700 mr-6 text-lg">並び替え</span>
        <div className="flex gap-4 sm:gap-8 w-full sm:w-auto">
          <button
            onClick={() => onSortChange('distance')}
            className={`flex-1 sm:flex-none px-8 py-1.5 rounded text-sm font-bold transition ${
              sortBy === 'distance'
                ? 'bg-[#F26546] text-white'
                : 'bg-[#444] text-white hover:bg-[#555]'
            }`}>
            距離
          </button>
          <button
            onClick={() => onSortChange('rating')}
            className={`flex-1 sm:flex-none px-8 py-1.5 rounded text-sm font-bold transition ${
              sortBy === 'rating'
                ? 'bg-[#F26546] text-white'
                : 'bg-[#444] text-white hover:bg-[#555]'
            }`}>
            評価
          </button>
        </div>
      </div>

      {cafes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {cafes.map((item) => (
            <CafeCard
              key={item.id}
              data={item}
              userLocation={userLocation}
              showDistance={showDistance}
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

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationButton
              key={page}
              active={currentPage === page}
              onClick={() => handlePageClick(page)}>
              {page}
            </PaginationButton>
          ))}

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </main>
  )
}

export default MainContent