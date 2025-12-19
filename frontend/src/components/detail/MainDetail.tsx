import { Bookmark, Camera, Check, ChevronLeft, ChevronRight, Clock, Coffee, ImageIcon, MapPin, Phone, Share2, Star } from "lucide-react"
import { useEffect, useState } from "react"
import SectionCard from "./SectionCard"
import FeatureItem from "./FeatureItem"
import ReviewForm from "./ReviewForm"
import type { Cafe } from "@/types/cafe"


const MainDetail: React.FC<{ cafe: Cafe }> = ({ cafe }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [reviews, setReviews] = useState(cafe.reviews || [])

  const handleAddReview = (newReview: {
    rating: number
    content: string
    image?: string
  }) => {
    const review = {
      id: reviews.length + 1,
      user: 'User Name',
      date: new Date().toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      rating: newReview.rating,
      content: newReview.content,
      image: newReview.image,
    }
    setReviews([review, ...reviews])
  }

  // Reset image index khi đổi cafe
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [cafe.id])

  const nextImage = () => {
    if (cafe.images && cafe.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % cafe.images!.length)
    }
  }

  const prevImage = () => {
    if (cafe.images && cafe.images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + cafe.images!.length) % cafe.images!.length,
      )
    }
  }

  const displayImage =
    cafe.images && cafe.images.length > 0
      ? cafe.images[currentImageIndex]
      : null

  return (
    <div className="w-full p-4 md:p-8 space-y-8 bg-white md:bg-transparent">
      <div className="bg-white md:rounded-xl md:shadow-md md:p-8 border border-gray-100 overflow-hidden w-full">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 aspect-video bg-gray-100 rounded-lg relative group overflow-hidden border border-gray-100">
            <div className="w-full h-full flex items-center justify-center bg-gray-200 relative overflow-hidden">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={cafe.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <ImageIcon size={64} className="text-gray-400" />
              )}

              {cafe.images && cafe.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      prevImage()
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100">
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100">
                    <ChevronRight size={24} />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {cafe.images.map((_, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer shadow-sm ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/60 hover:bg-white'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center space-y-5">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight text-left">
                {cafe.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={18}
                      className={
                        s <= Math.round(cafe.rating)
                          ? 'text-[#F26546] fill-[#F26546]'
                          : 'text-gray-200'
                      }
                    />
                  ))}
                </div>
                <span className="text-gray-500 text-sm font-medium">
                  ({cafe.rating}/5.0)
                </span>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed text-sm md:text-base border-l-4 border-[#F26546] pl-4 italic bg-gray-50 py-2 rounded-r text-left">
              {cafe.description || 'Chưa có mô tả chi tiết cho quán này.'}
            </p>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition">
                <MapPin size={20} className="text-[#F26546]" />
                <span className="font-medium">{cafe.address}</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition">
                <Clock size={20} className="text-[#F26546]" />
                <span className="font-medium">{cafe.hours}</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition">
                <Phone size={20} className="text-[#F26546]" />
                <span className="font-medium">
                  {cafe.phone || '090-XXXX-XXXX'}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100 justify-center">
              <button className="w-48 flex items-center justify-center gap-2 bg-[#F26546] text-white py-3 rounded-lg font-bold hover:bg-[#e05535] transition shadow-sm shadow-orange-200">
                <Bookmark size={18} /> 保存
              </button>
              <button className="w-48 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition">
                <Share2 size={18} /> 共有
              </button>
            </div>
          </div>
        </div>
      </div>

      {cafe.features && cafe.features.length > 0 && (
        <SectionCard title="お店の機能" icon={<Check size={18} />}>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cafe.features.map((feature, idx) => (
              <FeatureItem key={idx} text={feature} />
            ))}
          </ul>
        </SectionCard>
      )}

      {cafe.images && cafe.images.length > 0 && (
        <SectionCard title="お店の写真" icon={<Camera size={18} />}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {cafe.images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer group border transition ${currentImageIndex === idx ? 'border-[#F26546] ring-2 ring-[#F26546]/20' : 'border-gray-100 hover:shadow-md'}`}>
                <img
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {cafe.menu && cafe.menu.length > 0 && (
        <SectionCard title="お店のメニュー" icon={<Coffee size={18} />}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {cafe.menu.map((item, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-lg p-2 border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="aspect-video bg-gray-50 rounded-md flex items-center justify-center relative overflow-hidden mb-2">
                  <span className="absolute top-2 right-2 text-xs font-bold bg-[#F26546] text-white px-2 py-0.5 rounded-full shadow-sm z-10">
                    {item.price}
                  </span>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition"
                    />
                  ) : (
                    <ImageIcon
                      size={32}
                      className="text-gray-300 group-hover:scale-110 transition"
                    />
                  )}
                </div>
                <p className="text-center text-sm font-bold text-gray-700 group-hover:text-[#F26546] transition">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <SectionCard title="カフェの評価" icon={<Star size={18} />}>
        <ReviewForm onAddReview={handleAddReview} />

        <div className="space-y-6 w-full">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold border border-gray-200">
                      {review.user.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-gray-800 block text-left">
                        {review.user}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              className={
                                s <= review.rating
                                  ? 'text-[#F26546] fill-[#F26546]'
                                  : 'text-gray-200'
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                          | {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-13 pl-13">
                  {review.image && (
                    <div className="mb-3">
                      <img
                        src={review.image}
                        alt="Review"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-50 text-left">
                    {review.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm py-4">
              まだレビューはありません。
            </p>
          )}
        </div>
      </SectionCard>
    </div>
  )
}
export default MainDetail