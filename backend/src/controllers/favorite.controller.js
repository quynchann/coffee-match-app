import * as favoriteService from '@/services/favorite.service.js'

async function getFavoriteByUserId(req, res) {
  try {
    const userId = req.user.id

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu shop id'
      })
    }

    const shop = await favoriteService.handleGetFavoriteByUserId(userId)

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy quán'
      })
    }

    return res.status(200).json({
      success: true,
      data: shop
    })
  } catch (error) {
    console.error('ShopController.getShopById error:', error)
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin quán.',
      error: error.message
    })
  }
}

async function addFavorite(req, res) {
  const user_id = req.user.id

  const { shop_id } = req.body
  try {
    const data = await favoriteService.handleAddFavorite(user_id, shop_id)
    return res.status(200).json({
      success: true,
      data
    })
  } catch (error) {
    console.error('favoriteService error:', error)
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm yêu thích',
      error: error.message
    })
  }
}

async function removeFavorite(req, res) {
  const userId = req.user.id
  const { shopId } = req.params
  try {
    const data = await favoriteService.handleRemoveFavorite(userId, shopId)
    return res.status(200).json({
      success: true,
      data
    })
  } catch (error) {
    console.error('favoriteService error:', error)
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa yêu thích',
      error: error.message
    })
  }
}

async function getMyFavorites(req, res) {
  try {
    const userId = req.user.id

    const { page, limit } = req.query

    const response = await favoriteService.handleGetAllShopFavorite(
      userId,
      page,
      limit
    )

    return res.status(200).json({
      success: true,
      data: response.data,
      meta: response.meta
    })
  } catch (error) {
    console.error('favoriteService error:', error)
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách yêu thích',
      error: error.message
    })
  }
}

async function checkFavoriteStatus(req, res) {
  try {
    const userId = req.user.id
    const { shopId } = req.params

    const response = await favoriteService.handleCheckFavoriteStatus(
      userId,
      shopId
    )

    return res.status(200).json({
      success: true,
      data: response
    })
  } catch (error) {
    console.error('favoriteService error:', error)
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy trạng thái yêu thích',
      error: error.message
    })
  }
}

export default {
  getFavoriteByUserId,
  addFavorite,
  removeFavorite,
  getMyFavorites,
  checkFavoriteStatus
}
