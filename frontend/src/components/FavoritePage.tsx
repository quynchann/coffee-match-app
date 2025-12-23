import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import CafeCard from './cafe/CafeCard'
import PaginationButton from './pagination/PaginationButtonProps'
import { deleteFavorite, getAllShopsFavorite } from '@/services/favorite.api'
import { ITEMS_PER_PAGE } from '@/util/constant'

const FavoritePage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [favoriteShops, setFavoriteShops] = useState<Array<IShop>>([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  const fetchAllFavoriteData = async () => {
    try {
      setLoading(true)
      const page = currentPage
      const limit = ITEMS_PER_PAGE
      const favRes = await getAllShopsFavorite({ page, limit })

      if (favRes.data.success && favRes.data.data) {
        setFavoriteShops(favRes.data.data)
        setTotalPages(favRes.data.meta?.totalPages ?? 1)
      } else {
        setFavoriteShops([])
        setTotalPages(0)
      }
    } catch (error) {
      console.error('Failed to load favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllFavoriteData()
  }, [currentPage])

  const handleRemoveFavorite = async (shopId: string) => {
    try {
      await deleteFavorite(shopId)
      await fetchAllFavoriteData()
    } catch (error) {
      console.error('Xóa yêu thích thất bại:', error)
      fetchAllFavoriteData() // Reload lại nếu lỗi
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F9F9F9] p-4 font-sans md:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <main className="flex-1">
          {/* Header Section */}
          <div className="mb-8 flex justify-center">
            <div className="rounded bg-[#FF6347] px-12 py-3 text-center text-xl font-bold text-white shadow-sm">
              お気に入りのカフェ
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-[#FF6347]"></div>
              <p className="font-medium text-gray-500">読み込み中...</p>
            </div>
          ) : favoriteShops.length > 0 ? (
            <>
              {/* Grid Content */}
              <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {favoriteShops.map((item) => (
                  <CafeCard
                    isFavorite={true}
                    key={item._id}
                    data={item}
                    userLocation={userLocation}
                    showDistance={true}
                    handleToggle={handleRemoveFavorite}
                  />
                ))}
              </div>

              {/* Pagination Section */}
              {totalPages > 0 && (
                <div className="mt-8 mb-8 flex items-center justify-center gap-2 select-none">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="cursor-pointer rounded-md border border-gray-200 p-2 text-gray-500 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50">
                    <ChevronLeft size={18} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationButton
                        key={page}
                        active={currentPage === page}
                        onClick={() => {
                          setCurrentPage(page)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}>
                        {page}
                      </PaginationButton>
                    ),
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="cursor-pointer rounded-md border border-gray-200 p-2 text-gray-500 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50">
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white py-24 text-gray-500 shadow-sm">
              <div className="mb-6 rounded-full bg-gray-50 p-6">
                <Search size={64} className="text-gray-300" />
              </div>
              <p className="mb-2 text-xl font-bold text-gray-800">
                お気に入りのカフェはまだありません
              </p>
              <p className="max-w-md text-center text-gray-500">
                気になるカフェを見つけたら、ブックマークボタンを押してここに追加しましょう！
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default FavoritePage
