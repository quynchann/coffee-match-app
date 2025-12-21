import Shop from '@/models/Shop.js'

export async function createShop(data) {
  return await Shop.create(data)
}

export async function getShopById(id) {
  return await Shop.findById(id)
}

export async function updateShop(id, data) {
  return await Shop.findByIdAndUpdate(id, data, { new: true })
}

export async function deleteShop(id) {
  return await Shop.findByIdAndDelete(id)
}

export async function findAllShops(filters = {}) {
  const { page = 1, limit = 10 } = filters
  const skip = (page - 1) * limit

  const [products, totalDocs] = await Promise.all([
    Shop.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      //   .select('name price category') // Chỉ lấy field cần thiết
      .lean(), // Tối ưu tốc độ

    Shop.countDocuments()
  ])

  return {
    data: products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit)
    }
  }
}
