import Review from '@/models/Review.js'

export async function createReview(data) {
  return await Review.create(data)
}

export async function findById(reviewId) {
  return Review.findById(reviewId)
}

export async function updateById(reviewId, data) {
  return Review.findByIdAndUpdate(
    reviewId,
    {
      ...data,
      updatedAt: new Date()
    },
    { new: true }
  )
}

export async function deleteById(reviewId) {
  return Review.findByIdAndDelete(reviewId)
}

export async function findReviewsByShopId(filters, shopId) {
  const { page = 1, limit = 10 } = filters
  const pageNum = parseInt(page) || 1
  const limitNum = parseInt(limit) || 10
  const skip = (pageNum - 1) * limitNum

  const review = await Review.find({ shop_id: shopId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .populate('user_id', 'username avatar')
    .lean()

  const totalReviews = await Review.countDocuments({ shop: shopId })

  const mappedData = review.map((item) => {
    const { user_id, ...rest } = item
    return {
      ...rest,
      user: user_id
    }
  })

  return {
    data: mappedData,
    meta: {
      page: pageNum,
      limit: limitNum,
      total: totalReviews,
      totalPages: Math.ceil(totalReviews / limitNum)
    }
  }
}
