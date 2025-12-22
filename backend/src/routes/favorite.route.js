import express from 'express'
import favoriteController from '@/controllers/favorite.controller.js'

const favoriteRouter = express.Router()

favoriteRouter.get('/', favoriteController.getFavoriteByUserId)
favoriteRouter.post('/', favoriteController.addFavorite)
favoriteRouter.delete('/:shopId', favoriteController.removeFavorite)
favoriteRouter.get('/shops', favoriteController.getMyFavorites)
favoriteRouter.get(
  '/:shopId/favorite-status',
  favoriteController.checkFavoriteStatus
)

export default favoriteRouter
