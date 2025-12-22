import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import MainDetail from './detail/MainDetail'
import { Route } from '@/routes/_guest/detail/$id'
import { getShopById } from '@/services/search.api'

const DetailPage = () => {
  const { id } = Route.useParams()
  const [selectedCafe, setSelectedCafe] = useState<IShop | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShopDetail = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await getShopById(id)
        if (response.data.success && response.data.data) {
          const shop = response.data.data
          setSelectedCafe(shop)
        } else {
          setError('Không thể tải thông tin cửa hàng')
        }
      } catch (err) {
        console.error('Error fetching shop detail:', err)
        setError('Lỗi khi tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }

    fetchShopDetail()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center">
        <Loader2 className="size-10 animate-spin text-[#FF6347]" />
        <div className="mt-4 text-[#ff6347]">読み込み中...</div>
      </div>
    )
  }

  if (error || !selectedCafe) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center text-[#ff6347]">
          <p className="text-lg font-bold">{'エラーが発生しました'}</p>
          <p className="mt-2 text-sm">ページを再度読み込んでください</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F9F9F9] font-sans text-gray-800">
      <MainDetail cafe={selectedCafe} />
    </div>
  )
}

export default DetailPage
