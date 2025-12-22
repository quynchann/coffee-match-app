import instance from './axios.customize.js'

export const reviewAPI = {
  create: async (payload: any) => {
    // Lưu ý: payload ở đây là FormData
    const res = await instance.post('/review', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  getByShopId: async (
    filters: { page: number; limit: number },
    shopId: string,
  ) => {
    const res = await instance.get(`/review/${shopId}`, {
      params: filters,
    })
    return res.data
  },

  update: async (reviewId: string, payload: FormData) => {
    const res = await instance.put(`/review/${reviewId}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  delete: async (reviewId: string) => {
    const res = await instance.delete(`/review/${reviewId}`)
    return res.data
  },
}
