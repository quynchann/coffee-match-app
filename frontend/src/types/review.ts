export interface Review {
  _id: string
  userId: string | null
  user: {
    _id?: string
    username?: string
    avatar?: string
  }
  shopId: string
  rating: number
  content: string
  images?: Array<string>
  createdAt: string
}

// Filters for retrieving reviews
export interface ReviewFilters {
  page?: number
  limit?: number
}
