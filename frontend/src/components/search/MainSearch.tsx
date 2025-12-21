import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import CafeCard from '../cafe/CafeCard'
import PaginationButton from '../pagination/PaginationButtonProps'
import { useAuthStore } from '@/stores/useAuthStore'
import {
  deleteFavorite,
  getFavoriteByUserId,
  postFavorite,
} from '@/services/favorite.api'

type SortType = 'distance' | 'rating' | null

interface MainContentProps {
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  cafes: Array<IShop>
  sortBy: SortType
  onSortChange: (type: 'distance' | 'rating') => void
  userLocation: { lat: number; lng: number } | null
  showDistance: boolean
  loading?: boolean
  totalPages: number
}

const MainContent: React.FC<MainContentProps> = ({
  currentPage,
  setCurrentPage,
  cafes,
  sortBy,
  onSortChange,
  userLocation,
  showDistance,
  loading = false,
  totalPages,
}) => {
  // Vì API đã xử lý pagination, nên không cần slice dữ liệu

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

  const [favorites, setFavorites] = useState<Array<string>>([]) // Lưu mảng shop_id đã thích
  const { user } = useAuthStore()
  const handleToggle = async (shopId: string) => {
    if (!user) return
    const isFav = favorites.includes(shopId)
    const previousFavorites = [...favorites]

    try {
      if (isFav) {
        setFavorites((prev) => prev.filter((id) => id !== shopId))
        await deleteFavorite(shopId)
      } else {
        setFavorites((prev) => [...prev, shopId])
        await postFavorite(shopId)
      }
    } catch (error) {
      setFavorites(previousFavorites)
      console.error('Lỗi khi cập nhật yêu thích:', error)
    }
  }

  // Load favorite list
  useEffect(() => {
    const loadFavorite = async () => {
      const res = await getFavoriteByUserId()
      if (res.data.success && res.data.data) {
        setFavorites(res.data.data.map((f) => f.shop_id))
      }
    }
    if (user) loadFavorite()
  }, [user])

  return (
    <div className="flex-1">
      <div className="mb-8 flex justify-center">
        <div className="relative rounded bg-[#666] px-12 py-3 text-center text-xl font-bold text-white shadow-sm">
          カフェ検索結果
        </div>
      </div>

      <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded bg-[#D9D9D9] p-3 sm:flex-row sm:justify-start sm:gap-0">
        <span className="mr-6 text-lg font-bold text-gray-700">並び替え</span>
        <div className="flex w-full gap-4 sm:w-auto sm:gap-8">
          <button
            onClick={() => onSortChange('distance')}
            className={`flex-1 rounded px-8 py-1.5 text-sm font-bold transition sm:flex-none ${
              sortBy === 'distance'
                ? 'bg-[#F26546] text-white'
                : 'bg-[#444] text-white hover:bg-[#555]'
            }`}>
            距離
          </button>
          <button
            onClick={() => onSortChange('rating')}
            className={`flex-1 rounded px-8 py-1.5 text-sm font-bold transition sm:flex-none ${
              sortBy === 'rating'
                ? 'bg-[#F26546] text-white'
                : 'bg-[#444] text-white hover:bg-[#555]'
            }`}>
            評価
          </button>
        </div>
      </div>

      {cafes.length > 0 ? (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cafes.map((item) => (
            <CafeCard
              key={item._id}
              data={item}
              isFavorite={favorites.includes(item._id)}
              userLocation={userLocation}
              showDistance={showDistance}
              handleToggle={handleToggle}
            />
          ))}
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white py-20 text-gray-500">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#F26546]"></div>
          <p className="text-lg font-bold">読み込み中...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white py-20 text-gray-500">
          <Search size={48} className="mb-4 text-gray-300" />
          <p className="text-lg font-bold">
            適切なカフェが見つかりませんでした。
          </p>
          <p className="text-sm">
            フィルターやキーワードを変更してお試しください。
          </p>
        </div>
      )}

      {totalPages > 0 && (
        <div className="mt-8 mb-8 flex items-center justify-center gap-2 select-none">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="cursor-pointer rounded-md border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50">
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
            className="cursor-pointer rounded-md border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}

export default MainContent
