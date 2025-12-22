import express from 'express'
import * as reviewController from '@/controllers/review.controller.js'
import uploadFile from '@/middlewares/upload.middleware'

const reviewRouter = express.Router()

const uploadReviewImages = uploadFile('review').array('images', 5)

reviewRouter.get('/:shopId', reviewController.getReviewsByShopId)
reviewRouter.post('/', uploadReviewImages, reviewController.createReview)
reviewRouter.put(
  '/:reviewId',
  uploadReviewImages,
  reviewController.updateReview
)
reviewRouter.delete('/:reviewId', reviewController.deleteReview)

export default reviewRouter
