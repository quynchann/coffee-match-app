import * as favoriteRepo from '@/repositories/favorite.repository.js'

const handleGetFavoriteByUserId = async (userId) => {
  return await favoriteRepo.findFavoriteByUserId(userId)
}

const handleAddFavorite = async (user_id, shop_id) => {
  return await favoriteRepo.addFavorite(user_id, shop_id)
}

const handleRemoveFavorite = async (user_id, shop_id) => {
  return await favoriteRepo.removeFavorite(user_id, shop_id)
}

const handleGetAllShopFavorite = async (user_id, page, limit) => {
  return await favoriteRepo.findAllShopFavorite(user_id, page, limit)
}

const handleCheckFavoriteStatus = async (user_id, shop_id) => {
  return await favoriteRepo.checkFavoriteStatus(user_id, shop_id)
}

export {
  handleGetFavoriteByUserId,
  handleAddFavorite,
  handleRemoveFavorite,
  handleGetAllShopFavorite,
  handleCheckFavoriteStatus
}
