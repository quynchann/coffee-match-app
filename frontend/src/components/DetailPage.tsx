import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../stores/useAuthStore'
import MainDetail from './detail/MainDetail'
import { getShopById } from '@/services/search.api'
import { historyAPI } from '@/services/history.api'
import { Route } from '@/routes/_guest/detail/$id'

export default function DetailPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const { id } = Route.useParams() // shop ID from URL params

  const [selectedCafe, setSelectedCafe] = useState<IShop | null>(null)

  const loggedHistoryRef = useRef<string | number | null>(null)

  const {
    data: shopData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['shop', id],
    queryFn: () => getShopById(id).then((res) => res.data.data),
    enabled: !!id,
  })

  const createHistoryMutation = useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      historyAPI.create(userId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] })
    },
  })

  useEffect(() => {
    if (shopData) {
      setSelectedCafe(shopData)
    }

    if (user?._id && loggedHistoryRef.current !== id) {
      createHistoryMutation.mutate({
        userId: user._id,
      })

      // Mark this shop ID as logged to prevent duplicate history entries
      loggedHistoryRef.current = id
    }
  }, [shopData])

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center">
        <Loader2 className="size-10 animate-spin text-[#FF6347]" />
        <div className="mt-4 text-[#ff6347]">読み込み中...</div>
      </div>
    )
  }

  if (isError || !selectedCafe) {
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
