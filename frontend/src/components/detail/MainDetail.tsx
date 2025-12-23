import {
  Bookmark,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  DollarSign,
  ImageIcon,
  MapPin,
  Pencil,
  Phone,
  Share2,
  Star,
  Trash2,
  User,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import ReviewForm from './ReviewForm'
import SectionCard from './SectionCard'
import FeatureItem from './FeatureItem'
import type { Review } from '@/types/review'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { reviewAPI } from '@/services/review.api'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { useAuthStore } from '@/stores/useAuthStore'
import {
  deleteFavorite,
  getFavoriteStatus,
  postFavorite,
} from '@/services/favorite.api'

const MainDetail: React.FC<{ cafe: IShop }> = ({ cafe }) => {
  const { isAuthenticated, user } = useAuthStore()
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavoriteStatus, setIsFavoriteStatus] = useState<boolean>(false)

  // Delete review
  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) => reviewAPI.delete(reviewId),
    onSuccess: () => {
      toast.success('レビューを削除しました')
      refetchReviews()
    },
    onError: () => toast.error('削除に失敗しました'),
  })

  const handleToggleFavorite = async (id: string) => {
    if (!isAuthenticated) {
      toast.warning('この機能を使用するにはログインする必要があります')
    } else {
      if (!isFavoriteStatus) {
        await postFavorite(id)
        await fetchFavoriteStatus(id)
        toast.success('お気に入りに追加しました', { id: 'favorite' })
      } else {
        await deleteFavorite(id)
        await fetchFavoriteStatus(id)
        toast.success('お気に入りから削除しました。', { id: 'favorite' })
      }
    }
  }

  const fetchFavoriteStatus = async (shopId: string) => {
    if (isAuthenticated) {
      const res = await getFavoriteStatus(shopId)
      if (res.data.success) {
        setIsFavoriteStatus(res.data.data ?? false)
      }
    }
  }

  useEffect(() => {
    fetchFavoriteStatus(cafe._id)
  }, [])

  // Reset image index khi đổi cafe
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [cafe._id])

  const filters = { page: 1, limit: 10000 }

  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', filters, cafe._id],
    queryFn: () => reviewAPI.getByShopId(filters, cafe._id),
  })
  const reviews: Array<Review> = reviewsData?.data || []

  const nextImage = () => {
    if (cafe.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % cafe.images.length)
    }
  }

  const prevImage = () => {
    if (cafe.images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + cafe.images.length) % cafe.images.length,
      )
    }
  }

  // Reset when cafe changes
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [cafe._id])

  return (
    <div className="w-full space-y-8 bg-white p-4 md:bg-transparent md:p-8">
      <div className="w-full overflow-hidden border border-gray-100 bg-white md:rounded-xl md:p-8 md:shadow-md">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Image */}
          <div className="group relative aspect-video w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-100 md:w-1/2">
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gray-200">
              {cafe.images.length > 0 ? (
                <img
                  src={cafe.images[currentImageIndex]}
                  alt={cafe.name}
                  className="h-full w-full object-cover transition-opacity duration-300"
                />
              ) : (
                <ImageIcon size={64} className="text-gray-400" />
              )}

              {cafe.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      prevImage()
                    }}
                    className="absolute top-1/2 left-2 -translate-y-1/2 cursor-pointer rounded-full bg-black/30 p-2 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/50">
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                    className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-full bg-black/30 p-2 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/50">
                    <ChevronRight size={24} />
                  </button>

                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                    {cafe.images.map((_, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`h-2 w-2 cursor-pointer rounded-full shadow-sm transition-all ${idx === currentImageIndex ? 'w-4 bg-white' : 'bg-white/60 hover:bg-white'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex w-full flex-col justify-center space-y-5 md:w-1/2">
            <div>
              <h1 className="text-left text-3xl font-extrabold tracking-tight text-gray-800 md:text-4xl">
                {cafe.name}
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={18}
                      className={
                        s <= Math.round(cafe.rating)
                          ? 'fill-[#F26546] text-[#F26546]'
                          : 'text-gray-200'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-500">
                  ({cafe.rating}/5.0)
                </span>
              </div>
            </div>

            <p className="rounded-r border-l-4 border-[#F26546] bg-gray-50 py-2 pl-4 text-left text-sm leading-relaxed text-gray-600 italic md:text-base">
              {cafe.description || 'Chưa có mô tả chi tiết cho quán này.'}
            </p>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-3 rounded p-2 transition hover:bg-gray-50">
                <MapPin size={20} className="text-[#F26546]" />
                <span className="font-medium">{cafe.address}</span>
              </div>
              <div className="flex items-center gap-3 rounded p-2 transition hover:bg-gray-50">
                <DollarSign size={20} className="text-[#F26546]" />
                <span className="font-medium">
                  {cafe.priceRange.min} 円 ~ {cafe.priceRange.max} 円
                </span>
              </div>
              <div className="flex items-center gap-3 rounded p-2 transition hover:bg-gray-50">
                <Clock size={20} className="text-[#F26546]" />
                <span className="font-medium">
                  {cafe.hours.open} ~ {cafe.hours.close}
                </span>
              </div>
              <div className="flex items-center gap-3 rounded p-2 transition hover:bg-gray-50">
                <Phone size={20} className="text-[#F26546]" />
                <span className="font-medium">
                  {cafe.phone || '090-XXXX-XXXX'}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-3 border-t border-gray-100 pt-4">
              <Button
                onClick={() => handleToggleFavorite(cafe._id)}
                className={`h-12 w-48 font-bold transition ${
                  isFavoriteStatus
                    ? 'bg-[#F26546] text-white shadow-orange-200 hover:bg-[#e05535]'
                    : 'border border-[#F26546] bg-white text-[#F26546] hover:bg-orange-50'
                } `}>
                <Bookmark size={18} />
                {isFavoriteStatus ? ' お気に入り解除' : ' お気に入り追加'}
              </Button>

              <Button variant="outline" className="h-12 w-48 font-bold">
                <Share2 size={18} /> 共有
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      {cafe.features.length > 0 && (
        <SectionCard
          title="お店の機能"
          icon={<Check size={18} />}
          itemsLength={cafe.features.length}
          itemsPerPage={4}>
          {({ pageIndex }) => (
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-300"
                style={{ transform: `translateX(-${pageIndex * 100}%)` }}>
                {cafe.features.map((feature, idx) => (
                  <div key={idx} className="w-1/4 shrink-0 px-2">
                    <FeatureItem text={feature} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* Images */}
      {cafe.images.length > 0 && (
        <SectionCard
          title="お店の写真"
          icon={<Camera size={18} />}
          itemsLength={cafe.images.length}
          itemsPerPage={6}>
          {({ pageIndex }) => (
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-300"
                style={{ transform: `translateX(-${pageIndex * 100}%)` }}>
                {cafe.images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-1/6 shrink-0 px-2`}>
                    <div
                      className={`flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-lg border bg-gray-100 transition ${currentImageIndex === idx ? 'border-[#F26546] ring-2 ring-[#F26546]/20' : 'border-gray-100 hover:shadow-md'}`}>
                      <img
                        src={img}
                        alt={`Thumbnail ${idx}`}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* Menu */}
      {cafe.menu.length > 0 && (
        <SectionCard
          title="お店のメニュー"
          icon={<Coffee size={18} />}
          itemsLength={cafe.menu.length}
          itemsPerPage={6}>
          {({ pageIndex }) => (
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-300"
                style={{ transform: `translateX(-${pageIndex * 100}%)` }}>
                {cafe.menu.map((item, idx) => (
                  <div key={idx} className={`w-1/6 shrink-0 px-2`}>
                    <div className="group flex h-full flex-col rounded-lg border border-gray-100 bg-white p-2 transition hover:border-[#F26546]/50">
                      <div className="relative mb-2 flex aspect-video items-center justify-center overflow-hidden rounded-md">
                        <Badge className="absolute top-2 right-2 bg-[#F26546]">
                          {item.price} 円
                        </Badge>

                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <ImageIcon size={32} className="text-gray-300" />
                        )}
                      </div>
                      <p className="flex flex-1 items-center justify-center text-center text-sm font-bold text-gray-700 transition group-hover:text-[#F26546]">
                        {item.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      <SectionCard
        title="レビューを追加"
        icon={<User size={18} />}
        itemsLength={1}
        itemsPerPage={1}>
        <>
          {isAuthenticated && (
            <ReviewForm
              shopId={cafe._id}
              review={editingReview}
              onCancelEdit={() => setEditingReview(null)}
              onSuccess={() => {
                setEditingReview(null)
                refetchReviews()
              }}
            />
          )}

          {reviews.map((review, idx) => {
            const isOwner = review.user._id === user?._id

            return (
              <div
                key={idx}
                className="mb-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                {/* HEADER */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-bold">{review.user.username}</p>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {isOwner && (
                    <div>
                      <Button
                        variant="icon"
                        size="icon"
                        onClick={() => setEditingReview(review)}
                        className="text-sm text-blue-500 hover:text-blue-700">
                        <Pencil size={20} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="icon"
                            size="icon"
                            className="text-sm text-red-500 hover:text-red-700">
                            <Trash2 size={20} />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              本当にこのレビューを削除しますか？
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              この操作は取り消せません。削除すると、このレビューは完全に削除されます。
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(review._id)}>
                              削除する
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>

                {/* RATING */}
                <div className="mt-2 flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={
                        s <= review.rating
                          ? 'fill-[#F26546] text-[#F26546]'
                          : 'text-gray-200'
                      }
                    />
                  ))}
                </div>

                <p className="mt-3 text-gray-700">{review.content}</p>

                {review.images && review.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {review.images.map((img, i) => (
                      <img
                        key={i}
                        src={`${import.meta.env.VITE_BASE_URL_BACKEND}/images/review/${img}`}
                        className="h-24 w-full rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </>
      </SectionCard>
    </div>
  )
}

export default MainDetail
