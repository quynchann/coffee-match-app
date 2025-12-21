import Shop from '@/models/Shop.js'

async function findShopByFilter(filters = {}) {
  const match = {}

  const {
    keyword,
    area,
    purpose,
    min_price,
    max_price,
    amenities,
    sortRating,
    lat,
    lng,
    page = 1,
    limit = 8
  } = filters

  // Pagination
  const pageNum = Math.max(parseInt(page), 1)
  const limitNum = Math.max(parseInt(limit), 1)
  const skip = (pageNum - 1) * limitNum

  // Lọc theo từ khóa, khu vực, mục đích, tiện nghi
  if (keyword) {
    match.name = { $regex: new RegExp(keyword.trim(), 'i') }
  }

  if (area) {
    match.area = { $regex: new RegExp(area, 'i') }
  }

  if (purpose) {
    const purposes = String(purpose)
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)

    if (purposes.length) {
      match.purpose = { $in: purposes }
    }
  }

  if (amenities) {
    const ams = String(amenities)
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean)

    if (ams.length) {
      match.amenities = { $all: ams }
    }
  }

  // Lọc theo khoảng giá
  const minPrice =
    min_price !== undefined && min_price !== '' ? parseFloat(min_price) : null

  const maxPrice =
    max_price !== undefined && max_price !== '' ? parseFloat(max_price) : null

  if (minPrice != null && maxPrice != null) {
    match.$and = match.$and || []
    match.$and.push({ 'priceRange.min': { $lte: maxPrice } })
    match.$and.push({ 'priceRange.max': { $gte: minPrice } })
  } else if (minPrice != null) {
    match['priceRange.max'] = { $gte: minPrice }
  } else if (maxPrice != null) {
    match['priceRange.min'] = { $lte: maxPrice }
  }

  // Kiểm tra có tọa độ để thực hiện geo query hay không
  const hasLocation =
    lat !== undefined && lng !== undefined && lat !== '' && lng !== ''

  const latNum = hasLocation ? parseFloat(lat) : null
  const lngNum = hasLocation ? parseFloat(lng) : null

  const sortByRating =
    sortRating === true || String(sortRating).toLowerCase() === 'true'

  // Truy vấn với geoNear nếu có tọa độ
  if (hasLocation) {
    const basePipeline = [
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lngNum, latNum] },
          distanceField: 'distance',
          spherical: true
        }
      }
    ]

    if (Object.keys(match).length) {
      basePipeline.push({ $match: match })
    }

    // Đếm tổng
    const countPipeline = [...basePipeline, { $count: 'total' }]
    const countResult = await Shop.aggregate(countPipeline)
    const total = countResult[0]?.total || 0
    const totalPages = Math.ceil(total / limitNum)

    // Query chính
    const pipeline = [...basePipeline]

    pipeline.push({
      $addFields: {
        distance_km: { $divide: ['$distance', 1000] }
      }
    })

    pipeline.push({ $skip: skip })
    pipeline.push({ $limit: limitNum })
    pipeline.push({ $project: { distance: 0 } })

    const data = await Shop.aggregate(pipeline)

    return {
      data,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    }
  }

  // Truy vấn thông thường nếu không có tọa độ
  const total = await Shop.countDocuments(match)
  const totalPages = Math.ceil(total / limitNum)

  const query = Shop.find(match).skip(skip).limit(limitNum).lean()

  if (sortByRating) {
    query.sort({ rating: -1 })
  }

  const data = await query.exec()

  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages
    }
  }
}

async function getAllAreas() {
  return await Shop.distinct('area').exec()
}

async function getAllPurposes() {
  return await Shop.distinct('purpose').exec()
}

async function getAllAmenities() {
  return await Shop.distinct('amenities').exec()
}

async function getShopById(id) {
  return await Shop.findOne({ _id: id })
}

export {
  findShopByFilter,
  getAllAreas,
  getAllPurposes,
  getAllAmenities,
  getShopById
}
