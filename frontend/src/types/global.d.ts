export {}

declare global {
  interface IBackendRes<T> {
    error?: string | Array<string>
    message: string
    success: boolean
    data?: T
    meta?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }

  interface IProfile {
    name: string
    id: string
    username: string
    email: string
    styles: Array<string>
    address: string
    age: number
    avatar: string
  }

  interface IShop {
    _id: string
    name: string
    purpose: Array<string> // ví dụ: ["relax"]
    amenities: Array<string> // ví dụ: ["outdoor", "street"]
    features: Array<string> // mô tả ngắn (JP / VN / EN)
    hours: {
      open: string // "7:00"
      close: string // "23:00"
    }
    location: {
      type: 'Point'
      coordinates: [number, number] // [lng, lat]
    }
    address: string
    area: string // ví dụ: "hbt"
    priceRange: {
      min: number
      max: number
    }
    description: string
    phone: string
    images: Array<string>
    menu: Array<any> // có thể refine sau nếu có cấu trúc menu
    rating: number
    totalReviews: number
    createdAt: string // ISO string
    updatedAt: string // ISO string
  }

  interface ISearchShop {
    data: Array<IShop>
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }

  interface ISearchShopParams {
    keyword?: string
    area?: string
    purpose?: string | Array<string>
    amenities?: string | Array<string>
    min_price?: number
    max_price?: number
    lat?: number
    lng?: number
    sortRating?: boolean
    page?: number
    limit?: number
  }

  interface IFavorite {
    _id: string
    user_id: string
    shop_id: string
  }

  interface IShopFavorite {
    _id: string
    shop_id: IShop
  }

  interface IFavoriteParams {
    page: number
    limit: number
  }
}
