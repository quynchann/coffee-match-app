import { Star, Upload, User, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAuthStore } from '../../stores/useAuthStore'
import type { Review } from '@/types/review'
import { reviewAPI } from '@/services/review.api'

/* ===================== CONSTANT ===================== */
const MAX_REVIEW_LENGTH = 500
const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_IMAGES = 5
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]

/* ===================== TYPES ===================== */
type ReviewImage = {
  file: File
  preview: string
}

type ReviewErrors = {
  rating?: string
  content?: string
}

/* ===================== SCHEMA ===================== */
const reviewSchema = z.object({
  rating: z.number().min(1, '評価を選択してください'),
  content: z
    .string()
    .min(1, 'レビューを入力してください')
    .max(
      MAX_REVIEW_LENGTH,
      `レビューは${MAX_REVIEW_LENGTH}文字以内で入力してください`,
    ),
})

/* ===================== COMPONENT ===================== */
export default function ReviewForm({
  shopId,
  review,
  onSuccess,
  onCancelEdit,
}: {
  shopId: string
  review: Review | null
  onSuccess: () => void
  onCancelEdit: () => void
}) {
  const { user } = useAuthStore()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [hoverRating, setHoverRating] = useState<number>(0)
  const [imageError, setImageError] = useState<string>()
  const [errors, setErrors] = useState<ReviewErrors>({})

  const [formData, setFormData] = useState<{
    rating: number
    content: string
    images: Array<ReviewImage>
  }>({
    rating: 0,
    content: '',
    images: [],
  })

  /* ===================== MUTATION ===================== */
  const createMutation = useMutation({
    mutationFn: (payload: FormData) => reviewAPI.create(payload),
    onSuccess: () => {
      toast.success('レビューを投稿しました！')
      onSuccess()
      setFormData({ rating: 0, content: '', images: [] })
      setErrors({})
      setImageError(undefined)
    },
    onError: () => toast.error('レビューの投稿に失敗しました'),
  })

  /* ===================== HANDLERS ===================== */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    if (formData.images.length + files.length > MAX_IMAGES) {
      setImageError(`Chỉ được phép tối đa ${MAX_IMAGES} ảnh`)
      return
    }

    const validImages: Array<ReviewImage> = []

    for (const file of files) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setImageError('Định dạng ảnh không hợp lệ')
        continue
      }

      if (file.size > MAX_FILE_SIZE) {
        setImageError('Kích thước ảnh vượt quá 5MB')
        continue
      }

      validImages.push({
        file,
        preview: URL.createObjectURL(file),
      })
    }

    if (!validImages.length) return

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validImages],
    }))

    setImageError(undefined)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemoveImage = (index: number) => {
    const image = formData.images[index]
    URL.revokeObjectURL(image.preview)

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      reviewSchema.parse({
        rating: formData.rating,
        content: formData.content,
      })
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: ReviewErrors = {}
        err.issues.forEach((e) => {
          const key = e.path[0] as keyof ReviewErrors
          newErrors[key] = e.message
        })
        setErrors(newErrors)
      }
      return
    }

    const data = new FormData()
    data.append('user_id', user?._id ?? '')
    data.append('shop_id', shopId)
    data.append('rating', String(formData.rating))
    data.append('content', formData.content)

    formData.images.forEach((img) => {
      data.append('images', img.file)
    })

    if (review) {
      updateMutation.mutate({ reviewId: review._id, payload: data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleCancel = () => {
    onCancelEdit()
    setFormData({ rating: 0, content: '', images: [] })
    setErrors({})
    setImageError(undefined)
  }

  // Set dữ liệu khi edit
  useEffect(() => {
    if (review) {
      setFormData({
        rating: review.rating,
        content: review.content,
        images: [],
      })
    }
  }, [review])

  const updateMutation = useMutation({
    mutationFn: ({
      reviewId,
      payload,
    }: {
      reviewId: string
      payload: FormData
    }) => reviewAPI.update(reviewId, payload),
    onSuccess: () => {
      toast.success('レビューを更新しました')
      onSuccess()
      setFormData({ rating: 0, content: '', images: [] })
      setErrors({})
      setImageError(undefined)
    },
    onError: () => toast.error('更新に失敗しました'),
  })

  /* ===================== RENDER ===================== */
  return (
    <div className="max-w mb-4">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
        {/* USER */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-white text-gray-400">
              <User size={24} />
            </div>
            <div>
              <span className="block text-sm font-bold">{user?.username}</span>
              <span className="text-xs text-gray-500">レビューを書く</span>
            </div>
          </div>

          {/* RATING */}
          <div className="flex flex-col items-end">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={28}
                  className={`cursor-pointer ${
                    s <= (hoverRating || formData.rating)
                      ? 'fill-[#F26546] text-[#F26546]'
                      : 'text-gray-300'
                  }`}
                  onClick={() => setFormData((p) => ({ ...p, rating: s }))}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
            {errors.rating && (
              <p className="mt-1 text-xs text-red-500">{errors.rating}</p>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <textarea
          value={formData.content}
          onChange={(e) =>
            setFormData((p) => ({ ...p, content: e.target.value }))
          }
          className="min-h-[120px] w-full rounded-lg border p-4 text-sm focus:ring-2 focus:ring-[#F26546]/20"
          placeholder="このカフェはどうでしたか？"
        />
        {errors.content && (
          <p className="mt-1 text-xs text-red-500">{errors.content}</p>
        )}

        {/* IMAGES */}
        <div className="mt-4">
          <div className="mb-2 flex flex-wrap gap-3">
            {formData.images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.preview}
                  className="h-20 w-20 rounded-lg border object-cover"
                  alt="preview"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white">
                  <X size={12} />
                </button>
              </div>
            ))}

            {formData.images.length < MAX_IMAGES && (
              <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed text-gray-400 hover:bg-white">
                <Upload size={20} />
                <span className="text-[10px]">イメージ</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {imageError && <p className="text-xs text-red-500">{imageError}</p>}
        </div>

        {/* SUBMIT */}

        <div className="mt-6 flex justify-end gap-3">
          {review && (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border px-6 py-2">
              キャンセル
            </button>
          )}

          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="rounded-lg bg-[#F26546] px-8 py-2 font-bold text-white">
            {review ? '更新' : '送信'}
          </button>
        </div>
      </form>
    </div>
  )
}
