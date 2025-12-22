import * as reviewService from '@/services/review.service.js'

export async function createReview(req, res, next) {
  try {
    const { user_id, shop_id, rating, content } = req.body
    const images = req.files || []

    const newReview = await reviewService.createReview({
      user_id,
      shop_id,
      rating: Number(rating),
      content,
      images
    })

    res.status(201).json({
      success: true,
      data: newReview
    })
  } catch (error) {
    next(error)
  }
}

export async function getReviewsByShopId(req, res, next) {
  try {
    const filters = req.query
    const { shopId } = req.params
    const reviews = await reviewService.getReviewsByShopId(filters, shopId)
    res.status(200).json({
      success: true,
      ...reviews
    })
  } catch (error) {
    console.error('review.getReviewsByShopId error:', error)
    next(error)
  }
}

export async function updateReview(req, res, next) {
  try {
    const { reviewId } = req.params
    const { rating, content } = req.body
    const images = req.files || []
    const userId = req.user.id

    const updatedReview = await reviewService.updateReview({
      reviewId,
      userId,
      rating,
      content,
      images
    })

    res.status(200).json({
      success: true,
      data: updatedReview
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteReview(req, res, next) {
  try {
    const { reviewId } = req.params
    const userId = req.user.id

    await reviewService.deleteReview(reviewId, userId)

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}
