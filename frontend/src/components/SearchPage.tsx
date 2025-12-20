import { useEffect, useState } from 'react'
import FilterSidebar from './search/filter/FilterSidebar'
import MainContent from './search/MainSearch'
import type { Cafe } from '@/types/cafe'
import cafeDataRaw from '@/data/cafes.json'

interface Filters {
  area: string | null
  purpose: string | null
  priceMin: number | null
  priceMax: number | null
  amenities: Array<string>
}

const CAFES_DATA: Array<Cafe> = cafeDataRaw as Array<Cafe>

export default function SearchPage({
  initialKeyword = '',
}: {
  initialKeyword?: string
}) {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [filters, setFilters] = useState<Filters>({
    area: null,
    purpose: null,
    priceMin: null,
    priceMax: null,
    amenities: [],
  })
  const [sortBy, setSortBy] = useState<{
    distance: boolean
    rating: boolean
  }>({
    distance: false,
    rating: false,
  })
  const [priceInputs, setPriceInputs] = useState<{ min: string; max: string }>({
    min: '',
    max: '',
  })
  const [priceApplied, setPriceApplied] = useState<boolean>(false)
  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  const parsePriceInput = (value: string) => {
    const numeric = parseInt(value.replace(/[^0-9]/g, ''), 10)
    return Number.isFinite(numeric) ? numeric : null
  }

  const handleApplyPrice = () => {
    const minValue = parsePriceInput(priceInputs.min)
    const maxValue = parsePriceInput(priceInputs.max)
    setFilters((prev) => ({ ...prev, priceMin: minValue, priceMax: maxValue }))
    setPriceApplied(true)
  }

  // Calculate distance using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371 // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }
  // Logic lọc dữ liệu tổng hợp (Filter + Keyword)
  const filteredData = CAFES_DATA.filter((item) => {
    // Lọc theo Keyword
    const normalizedKeyword = initialKeyword.toLowerCase().trim()
    const matchSearch =
      !normalizedKeyword ||
      item.name.toLowerCase().includes(normalizedKeyword) ||
      item.address.toLowerCase().includes(normalizedKeyword)

    // Lọc theo Dropdown
    const matchArea = filters.area ? item.area === filters.area : true
    const matchPurpose = filters.purpose
      ? item.purpose === filters.purpose
      : true

    const matchAmenities = (() => {
      if (!filters.amenities.length) return true
      const cafeAmenities = item.amenities || []

      return filters.amenities.every((need) => {
        if (need === 'kids') return cafeAmenities.includes('kids')
        if (need === 'nosmoke') return cafeAmenities.includes('nosmoke')
        return cafeAmenities.includes(need)
      })
    })()

    // Lọc theo giá
    const matchPrice = (() => {
      const { priceMin, priceMax } = filters
      if (priceMin === null && priceMax === null) return true
      if (!item.priceRange) return false

      const [rangeMinStr, rangeMaxStr] = item.priceRange.split('-')
      const rangeMin = parseInt(rangeMinStr, 10)
      const rangeMax = parseInt(rangeMaxStr, 10)
      if (Number.isNaN(rangeMin) || Number.isNaN(rangeMax)) return false

      if (priceMin !== null && rangeMax < priceMin) return false
      if (priceMax !== null && rangeMin > priceMax) return false
      return true
    })()

    return (
      matchSearch && matchArea && matchPurpose && matchAmenities && matchPrice
    )
  })

  // Sort dữ liệu theo rating hoặc distance
  const sortedData = [...filteredData].sort((a, b) => {
    // Priority 1: Sort by distance if enabled
    if (sortBy.distance && userLocation) {
      const distA =
        a.lat && a.lng
          ? calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng)
          : Infinity
      const distB =
        b.lat && b.lng
          ? calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng)
          : Infinity
      if (distA !== distB) return distA - distB
    }
    // Priority 2: Sort by rating if enabled
    if (sortBy.rating) {
      return b.rating - a.rating
    }
    return 0
  })

  // Reset về trang 1 khi filter hoặc sort thay đổi
  useEffect(() => {
    setCurrentPage(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [filters, initialKeyword, sortBy])

  const ITEMS_PER_PAGE = 12
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem)

  const handleSortChange = (type: 'distance' | 'rating') => {
    setSortBy((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))

    // Get user location when distance sort is selected
    if (type === 'distance' && !sortBy.distance && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          // Fallback to Hanoi center
          setUserLocation({ lat: 21.0285, lng: 105.8542 })
        },
      )
    }
  }

  return (
    <div className="flex w-full flex-col font-sans">
      <div className="relative flex w-full flex-col gap-8 p-4 md:flex-row md:px-8 md:py-8">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          priceInputs={priceInputs}
          setPriceInputs={setPriceInputs}
          onApplyPrice={handleApplyPrice}
          priceApplied={priceApplied}
          setPriceApplied={setPriceApplied}
        />
        <MainContent
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          cafes={currentItems}
          totalItems={sortedData.length}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          userLocation={userLocation}
          showDistance={sortBy.distance}
        />
      </div>
    </div>
  )
}
