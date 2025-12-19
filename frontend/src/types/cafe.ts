export interface Area {
  id: string
  label: string
  jpLabel: string
}

export interface Purpose {
  id: string
  label: string
  jpLabel: string
}

export interface Cafe {
  id: number
  name: string
  rating: number
  hours: string
  address: string
  area: string
  purpose: string
  description?: string
  phone?: string
  features?: Array<string>
  images?: Array<string>
  menu?: Array<{ name: string; price: string; image?: string }>
  reviews?: Array<{
    id: number
    user: string
    date: string
    rating: number
    content: string
    image?: string
  }>
  lat?: number
  lng?: number
  amenities?: Array<string>
  priceRange?: string
}
