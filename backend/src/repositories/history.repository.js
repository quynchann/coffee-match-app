import History from '@/models/History.js'
import '@/models/Shop.js'
import * as cursorUtils from '@/utils/cursor-utils.js'

export async function createHistory(data) {
  return await History.create(data)
}

export async function getHistoryById(id) {
  return await History.findById(id)
}

export async function updateHistory(id, data) {
  return await History.findByIdAndUpdate(id, data, { new: true })
}

export async function deleteHistory(id) {
  return await History.findByIdAndDelete(id)
}

export async function findAllHistories(filters = {}) {
  const { user_id, cursor, limit = 10 } = filters
  const limitNum = parseInt(limit)

  if (!user_id)
    return { data: [], meta: { nextCursor: null, hasNextPage: false } }

  const query = { user_id: user_id }

  if (cursor) {
    const decoded = cursorUtils.decodeCursor(cursor)

    if (decoded) {
      const { createdAt, _id } = decoded

      // Tìm cái cũ hơn (createdAt < cursorTime)
      // HOẶC bằng thời gian nhưng _id nhỏ hơn (createdAt == cursorTime && _id < cursorId)
      query.$or = [
        { createdAt: { $lt: createdAt } },
        {
          createdAt: createdAt,
          _id: { $lt: _id }
        }
      ]
    }
  }

  // Lưu ý: Lấy limit + 1 để check xem còn trang sau không
  const histories = await History.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limitNum + 1)
    .populate('shop_id', 'name hours address area rating images') // Populate shop info
    .lean() // Tối ưu JSON

  // Xử lý phân trang
  const hasNextPage = histories.length > limitNum

  // Nếu có trang sau, cắt bỏ item thừa thứ 11 đi
  const data = hasNextPage ? histories.slice(0, -1) : histories

  // Tạo Next Cursor
  let nextCursor = null
  if (hasNextPage && data.length > 0) {
    const lastItem = data[data.length - 1]
    nextCursor = cursorUtils.encodeCursor({
      createdAt: lastItem.createdAt,
      _id: lastItem._id
    })
  }

  const mappedData = data.map((item) => {
    const { shop_id, user_id, ...rest } = item
    return {
      ...rest,
      shop: shop_id,
      user: user_id
    }
  })

  return {
    data: mappedData,
    meta: {
      nextCursor,
      hasNextPage
    }
  }
}

export async function deleteManyHistories(_ids) {
  return await History.deleteMany({ _id: { $in: _ids } })
}
