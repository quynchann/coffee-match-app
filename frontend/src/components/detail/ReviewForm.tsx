import { Star, Upload, User } from "lucide-react"
import React, { useState } from "react"

interface ReviewFormProps {
  onAddReview: (review: {
    rating: number
    content: string
    image?: string
  }) => void
}

const MAX_REVIEW_LENGTH = 500
const MAX_FILE_SIZE = 5 * 1024 * 1024
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

export default ReviewForm 