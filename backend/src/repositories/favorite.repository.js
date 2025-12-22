import Favorite from '@/models/Favorite.js'
import mongoose from 'mongoose'

async function findFavoriteByUserId(user_id) {
  return await Favorite.find({
    user_id: new mongoose.Types.ObjectId(user_id)
  })
}

async function addFavorite(user_id, shop_id) {
  const uId = new mongoose.Types.ObjectId(user_id)
  const sId = new mongoose.Types.ObjectId(shop_id)

  const existingFavorite = await Favorite.findOne({
    user_id: uId,
    shop_id: sId
  })

  if (existingFavorite) {
    return existingFavorite
  }

  return Favorite.create({
    user_id: uId,
    shop_id: sId
  })
}

async function removeFavorite(user_id, shop_id) {
  const uId = new mongoose.Types.ObjectId(user_id)
  const sId = new mongoose.Types.ObjectId(shop_id)

  return await Favorite.findOneAndDelete({
    user_id: uId,
    shop_id: sId
  })
}

async function findAllShopFavorite(userId, page = 1, limit = 8) {
  const uId = new mongoose.Types.ObjectId(userId)
  const skip = (page - 1) * limit

  const [favorites, total] = await Promise.all([
    Favorite.find({ user_id: uId })
      .populate({
        path: 'shop_id',
        select: '-__v' // optional
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Favorite.countDocuments({ user_id: uId })
  ])

  const shops = favorites.map((f) => f.shop_id)

  return {
    data: shops,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

async function checkFavoriteStatus(user_id, shop_id) {
  const favorite = await Favorite.findOne({ user_id, shop_id })
  return !!favorite
}

export {
  findFavoriteByUserId,
  addFavorite,
  removeFavorite,
  findAllShopFavorite,
  checkFavoriteStatus
}
