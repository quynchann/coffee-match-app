import React, { useState, useEffect } from 'react'
import {
  Bookmark,
  User,
  Star,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin,
  Clock,
  Phone,
  Share2,
  Upload,
  Camera,
  Wifi,
  Car,
  Coffee,
  Dog,
  Volume2,
} from 'lucide-react'

// Import dữ liệu từ file JSON
import cafeDataRaw from '@/data/cafes.json'

// --- Interfaces ---

export interface Cafe {
  id: number
  name: string
  rating: number
  hours: string
  address: string
  area: string
  purpose: string
  description?: string
  phone?: string
  features?: string[]
  images?: string[]
  menu?: { name: string; price: string; image?: string }[]
  reviews?: {
    id: number
    user: string
    date: string
    rating: number
    content: string
    image?: string
  }[]
}

// Ép kiểu dữ liệu
const CAFES_DATA: Cafe[] = cafeDataRaw as Cafe[]

// --- Sub Components ---

interface ReviewFormProps {
  onAddReview: (review: {
    rating: number
    content: string
    image?: string
  }) => void
}

// Constants cho validation
const MAX_REVIEW_LENGTH = 500
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]

const ReviewForm: React.FC<ReviewFormProps> = ({ onAddReview }) => {
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [reviewText, setReviewText] = useState<string>('')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Error states
  const [errors, setErrors] = useState<{
    rating?: string
    content?: string
    image?: string
  }>({})

  // Validate rating
  const validateRating = () => {
    if (rating === 0) {
      setErrors((prev) => ({ ...prev, rating: '評価を選択してください' }))
      return false
    }
    setErrors((prev) => ({ ...prev, rating: undefined }))
    return true
  }

  // Validate content
  const validateContent = (text: string) => {
    if (!text.trim()) {
      setErrors((prev) => ({ ...prev, content: 'レビューを入力してください' }))
      return false
    }
    if (text.length > MAX_REVIEW_LENGTH) {
      setErrors((prev) => ({
        ...prev,
        content: `レビューは${MAX_REVIEW_LENGTH}文字以内で入力してください`,
      }))
      return false
    }
    setErrors((prev) => ({ ...prev, content: undefined }))
    return true
  }

  // Handle text change with validation
  const handleTextChange = (text: string) => {
    setReviewText(text)
    if (text.length > 0) {
      validateContent(text)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: '画像ファイルのみアップロード可能です (JPEG, PNG, GIF, WebP)',
      }))
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        image: `ファイルサイズは${MAX_FILE_SIZE / 1024 / 1024}MB以下にしてください`,
      }))
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    // Clear image error if validation passes
    setErrors((prev) => ({ ...prev, image: undefined }))

    const reader = new FileReader()
    reader.onloadend = () => {
      setUploadedImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setUploadedImage(null)
    setErrors((prev) => ({ ...prev, image: undefined }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = () => {
    // Validate all fields
    const isRatingValid = validateRating()
    const isContentValid = validateContent(reviewText)

    if (!isRatingValid || !isContentValid) {
      return
    }

    // Gọi callback để thêm review
    onAddReview({
      rating,
      content: reviewText,
      image: uploadedImage || undefined,
    })

    // Success notification
    alert('レビューを送信しました！')

    // Reset form
    setRating(0)
    setReviewText('')
    setUploadedImage(null)
  }

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8 w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400">
            <User size={20} />
          </div>
          <div>
            <span className="font-bold text-sm block text-gray-800 text-left">
              User Name
            </span>
            <span className="text-xs text-gray-500">レビューを書く</span>
          </div>
        </div>
        <div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                className={`cursor-pointer transition-all ${
                  star <= (hoverRating || rating)
                    ? 'text-[#F26546] fill-[#F26546]'
                    : 'text-gray-300'
                } hover:scale-110`}
                onClick={() => {
                  setRating(star)
                  setErrors((prev) => ({ ...prev, rating: undefined }))
                }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
          {errors.rating && (
            <p className="text-xs text-red-500 mt-1 text-right">
              {errors.rating}
            </p>
          )}
        </div>
      </div>

      <div className="mb-3">
        <div className="relative">
          <textarea
            value={reviewText}
            onChange={(e) => handleTextChange(e.target.value)}
            className={`w-full border ${errors.content ? 'border-red-300' : 'border-gray-200'} rounded-lg p-4 pr-12 text-sm focus:outline-none focus:ring-2 ${errors.content ? 'focus:ring-red-200 focus:border-red-400' : 'focus:ring-[#F26546]/20 focus:border-[#F26546]'} min-h-[100px] bg-white transition-all shadow-inner`}
            placeholder="このカフェはどうでしたか？"
            maxLength={MAX_REVIEW_LENGTH}
          />
          <div className="absolute bottom-3 right-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="review-image-upload"
            />
            <label
              htmlFor="review-image-upload"
              className="p-2 text-gray-400 hover:text-[#F26546] hover:bg-orange-50 rounded-full transition cursor-pointer inline-flex">
              <Upload size={20} />
            </label>
          </div>
        </div>
        <div className="flex justify-between items-center mt-1">
          <div>
            {errors.content && (
              <p className="text-xs text-red-500">{errors.content}</p>
            )}
          </div>
          <p
            className={`text-xs ${reviewText.length > MAX_REVIEW_LENGTH * 0.9 ? 'text-orange-500' : 'text-gray-400'}`}>
            {reviewText.length}/{MAX_REVIEW_LENGTH}
          </p>
        </div>
      </div>

      {errors.image && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600 flex items-center gap-2">
            <span className="font-bold">⚠</span>
            {errors.image}
          </p>
        </div>
      )}

      {uploadedImage && (
        <div className="mb-3 relative inline-block">
          <img
            src={uploadedImage}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition shadow-md">
            ×
          </button>
        </div>
      )}

      <div className="flex justify-end mt-3">
        <button
          onClick={handleSubmit}
          className="bg-[#444] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#222] transition shadow-sm hover:shadow">
          送信
        </button>
      </div>
    </div>
  )
}

const SectionCard: React.FC<{
  title: string
  children: React.ReactNode
  icon?: React.ReactNode
}> = ({ title, children, icon }) => {
  return (
    <div className="relative mt-8 group w-full">
      <div className="absolute -top-4 left-6 bg-white px-3 py-1 flex items-center gap-2 z-10 border border-[#F26546]/20 rounded-full shadow-sm">
        {icon && <span className="text-[#F26546]">{icon}</span>}
        <h2 className="font-bold text-[#F26546] text-sm md:text-base tracking-wide">
          {title}
        </h2>
      </div>
      <div className="bg-white rounded-xl border border-[#F26546]/30 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 w-full">
        {children}
      </div>
    </div>
  )
}

const FeatureItem: React.FC<{ text: string }> = ({ text }) => {
  let Icon = Check
  if (text.includes('Wi-Fi')) Icon = Wifi
  if (text.includes('駐車場') || text.includes('đỗ xe')) Icon = Car
  if (text.includes('軽食') || text.includes('ăn')) Icon = Coffee
  if (text.includes('ペット') || text.includes('thú cưng')) Icon = Dog
  if (text.includes('静か') || text.includes('yên tĩnh')) Icon = Volume2

  return (
    <li className="flex items-center gap-3 p-3 rounded-lg bg-orange-50/50 border border-orange-100/50 hover:bg-orange-50 transition-colors">
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#F26546] border border-orange-100 flex-shrink-0">
        <Icon size={16} />
      </div>
      <span className="text-sm font-medium text-gray-700">{text}</span>
    </li>
  )
}

const DetailView: React.FC<{ cafe: Cafe }> = ({ cafe }) => {
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
      {/* 1. Hero Section */}
      <div className="bg-white md:rounded-xl md:shadow-md md:p-8 border border-gray-100 overflow-hidden w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Image Carousel */}
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

              {/* Navigation Buttons */}
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

                  {/* Dots Indicator */}
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

      {/* 2. Features */}
      {cafe.features && cafe.features.length > 0 && (
        <SectionCard title="お店の機能" icon={<Check size={18} />}>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cafe.features.map((feature, idx) => (
              <FeatureItem key={idx} text={feature} />
            ))}
          </ul>
        </SectionCard>
      )}

      {/* 3. Photos */}
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

      {/* 4. Menu */}
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

      {/* 5. Reviews */}
      <SectionCard title="カフェの評価" icon={<Star size={18} />}>
        <ReviewForm onAddReview={handleAddReview} />

        <div className="space-y-6 w-full">
          {reviews && reviews.length > 0 ? (
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

// --- Main Container ---

const DetailPage: React.FC = () => {
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null)

  useEffect(() => {
    // Lấy ID từ URL (query param ?id=...)
    const params = new URLSearchParams(window.location.search)
    const idParam = params.get('id')

    if (idParam) {
      const foundCafe = CAFES_DATA.find((c) => c.id === Number(idParam))
      if (foundCafe) {
        setSelectedCafe(foundCafe)
      } else {
        // Fallback nếu ID không tồn tại: Chọn quán đầu tiên
        setSelectedCafe(CAFES_DATA[0])
      }
    } else {
      // Fallback nếu không có ID: Chọn quán đầu tiên
      setSelectedCafe(CAFES_DATA[0])
    }
  }, [])

  if (!selectedCafe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col font-sans w-full text-gray-800">
      <DetailView cafe={selectedCafe} />
    </div>
  )
}

export default DetailPage
