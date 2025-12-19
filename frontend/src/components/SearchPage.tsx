import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  Bookmark,
  Star,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import cafeDataRaw from '@/data/cafes.json'

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
  priceRange?: string
  amenities?: string[]
  features?: string[]
  images?: string[]
  lat?: number
  lng?: number
}

interface Area {
  id: string
  label: string
  jpLabel: string
}

interface Purpose {
  id: string
  label: string
  jpLabel: string
}

interface Filters {
  area: string | null
  purpose: string | null
  priceMin: number | null
  priceMax: number | null
  amenities: string[]
}

const AREAS = [
  { id: 'hbt', label: 'Hai Ba Trung', jpLabel: 'ハイバーチュン区' },
  { id: 'hk', label: 'Hoan Kiem', jpLabel: 'ホアンキエム区' },
  { id: 'cg', label: 'Cau Giay', jpLabel: 'カウザイ区' },
  { id: 'bd', label: 'Ba Dinh', jpLabel: 'バーディン区' },
]

const PURPOSES = [
  { id: 'study', label: 'Hoc tap', jpLabel: '勉強' },
  { id: 'work', label: 'Cong viec', jpLabel: '仕事' },
  { id: 'date', label: 'Hen ho', jpLabel: 'デート' },
  { id: 'relax', label: 'Thu gian', jpLabel: 'リラックス' },
]

const AMENITY_FILTERS = [
  { id: 'wifi', label: 'Wi-Fiあり' },
  { id: 'kids', label: '子どもOK' },
  { id: 'quiet', label: '静か' },
  { id: 'ac', label: 'エアコンあり' },
  { id: 'nosmoke', label: '禁煙席あり' },
]

const CAFES_DATA: Cafe[] = cafeDataRaw as Cafe[]

interface FilterDropdownProps {
  title: string
  options: (Area | Purpose)[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  placeholder: string
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  title,
  options,
  selectedId,
  onSelect,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) => opt.id === selectedId)
  const displayLabel = selectedOption ? selectedOption.jpLabel : placeholder

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full py-3 px-4 rounded flex justify-between items-center shadow-md transition
          ${isOpen ? 'bg-[#333] text-white' : 'bg-[#111] text-white hover:bg-black'}
        `}>
        <span className="font-bold truncate pr-2">
          {selectedId ? displayLabel : title}
        </span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-md shadow-xl border border-gray-200 z-20 overflow-hidden">
          <button
            onClick={() => {
              onSelect(null)
              setIsOpen(false)
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 border-b border-gray-100 font-medium">
            -- すべて / リセット --
          </button>

          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                onSelect(opt.id)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-3 text-sm flex justify-between items-center hover:bg-gray-50 transition
                ${selectedId === opt.id ? 'text-[#F26546] font-bold bg-orange-50' : 'text-gray-700'}
              `}>
              <div>
                <div className="font-bold">{opt.jpLabel}</div>
                <div className="text-xs text-gray-400 font-normal">
                  {opt.label}
                </div>
              </div>
              {selectedId === opt.id && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface FilterSidebarProps {
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  priceInputs: { min: string; max: string }
  setPriceInputs: React.Dispatch<
    React.SetStateAction<{ min: string; max: string }>
  >
  onApplyPrice: () => void
  priceApplied: boolean
  setPriceApplied: React.Dispatch<React.SetStateAction<boolean>>
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  priceInputs,
  setPriceInputs,
  onApplyPrice,
  priceApplied,
  setPriceApplied,
}) => {
  return (
    <aside className="w-full md:w-64 shrink-0 space-y-6 md:sticky md:top-24 h-fit">
      <FilterDropdown
        title="場所"
        placeholder="場所"
        options={AREAS}
        selectedId={filters.area}
        onSelect={(id) => setFilters((prev) => ({ ...prev, area: id }))}
      />

      <FilterDropdown
        title="目的"
        placeholder="目的"
        options={PURPOSES}
        selectedId={filters.purpose}
        onSelect={(id) => setFilters((prev) => ({ ...prev, purpose: id }))}
      />

      <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
        <div className="bg-[#555] text-white text-center py-1.5 rounded text-sm font-bold mb-4">
          価格帯
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <span className="absolute right-2 top-2 text-gray-500 text-xs">
              VND
            </span>
            <input
              type="text"
              placeholder="から"
              className="w-full border border-gray-300 rounded px-2 py-1.5 pr-10 text-sm focus:outline-none focus:border-[#F26546]"
              value={priceInputs.min}
              onChange={(e) => {
                setPriceInputs((prev) => ({ ...prev, min: e.target.value }))
                setPriceApplied(false)
              }}
            />
          </div>
          <span className="text-gray-500">~</span>
          <div className="relative flex-1">
            <span className="absolute right-2 top-2 text-gray-500 text-xs">
              VND
            </span>
            <input
              type="text"
              placeholder="まで"
              className="w-full border border-gray-300 rounded px-2 py-1.5 pr-10 text-sm focus:outline-none focus:border-[#F26546]"
              value={priceInputs.max}
              onChange={(e) => {
                setPriceInputs((prev) => ({ ...prev, max: e.target.value }))
                setPriceApplied(false)
              }}
            />
          </div>
        </div>

        <button
          onClick={onApplyPrice}
          className={`w-full text-white font-bold py-2 rounded mb-6 transition shadow-sm ${
            priceApplied
              ? 'bg-[#e85f2f] shadow-md ring-2 ring-[#f26546]/40'
              : 'bg-[#FF7F50] hover:opacity-90'
          }`}>
          適用
        </button>

        <div className="space-y-2">
          {AMENITY_FILTERS.map((amenity) => {
            const isActive = filters.amenities.includes(amenity.id)
            return (
              <button
                key={amenity.id}
                onClick={() => {
                  setFilters((prev) => {
                    const exists = prev.amenities.includes(amenity.id)
                    return {
                      ...prev,
                      amenities: exists
                        ? prev.amenities.filter((a) => a !== amenity.id)
                        : [...prev.amenities, amenity.id],
                    }
                  })
                }}
                className={`w-full py-2.5 px-4 rounded text-sm font-bold transition flex items-center justify-center gap-2 border ${
                  isActive
                    ? 'bg-[#F26546] text-white border-[#F26546] shadow-sm'
                    : 'bg-[#444444] text-white hover:bg-[#555] border-[#444444]'
                }`}>
                {amenity.label}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

const CafeCard: React.FC<{
  data: Cafe
  userLocation: { lat: number; lng: number } | null
  showDistance: boolean
}> = ({ data, userLocation, showDistance }) => {
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)
  const areaInfo = AREAS.find((a) => a.id === data.area)
  const purposeInfo = PURPOSES.find((p) => p.id === data.purpose)

  // Calculate distance
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

  const distance =
    userLocation && data.lat && data.lng
      ? calculateDistance(
          userLocation.lat,
          userLocation.lng,
          data.lat,
          data.lng,
        )
      : null

  const formatDistance = (distKm: number): string => {
    if (distKm < 1) {
      return `${Math.round(distKm * 1000)}m`
    }
    return `${distKm.toFixed(1)}km`
  }

  const displayImage =
    data.images && data.images.length > 0 ? data.images[0] : null

  const handleClick = () => {
    navigate({ to: '/detail', search: { id: data.id } })
  }

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group h-full flex flex-col cursor-pointer">
      <div className="h-40 bg-gray-200 relative flex items-center justify-center overflow-hidden shrink-0">
        {displayImage ? (
          <img
            src={displayImage}
            alt={data.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
        ) : (
          <ImageIcon
            size={48}
            className="text-gray-400 group-hover:scale-110 transition duration-500"
          />
        )}

        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsFavorite(!isFavorite)
          }}
          className={`absolute top-2 right-2 rounded-full p-1 shadow-sm transition ${
            isFavorite ? 'text-[#F26546] bg-white' : 'text-gray-400 bg-white'
          }`}>
          <Bookmark size={16} fill={isFavorite ? '#F26546' : 'white'} />
        </button>

        {purposeInfo && (
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
            {purposeInfo.jpLabel}
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
            {data.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-lg font-bold text-gray-700">
              {data.rating}
            </span>
            <Star size={16} className="text-[#F26546]" fill="#F26546" />
          </div>
        </div>

        <div className="text-xs text-gray-600 space-y-1 mt-auto">
          <p className="text-left">営業時間: {data.hours}</p>
          <p className="line-clamp-1 text-left">住所: {data.address}</p>
          <p className="font-semibold text-gray-500 text-left">
            {areaInfo ? `${areaInfo.jpLabel} (${areaInfo.label})` : 'Hanoi'}
          </p>
          {showDistance && distance !== null && (
            <p className="text-left font-bold text-[#F26546]">
              距離: {formatDistance(distance)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

interface PaginationButtonProps {
  active?: boolean
  children: React.ReactNode
  onClick: () => void
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
  active = false,
  children,
  onClick,
}) => {
  const baseClass =
    'w-9 h-9 flex items-center justify-center rounded-md text-sm font-bold transition-all duration-200 border cursor-pointer select-none'
  const activeClass =
    'bg-[#F26546] text-white border-[#F26546] shadow-sm transform scale-105'
  const inactiveClass =
    'bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:text-[#F26546]'

  return (
    <button
      className={`${baseClass} ${active ? activeClass : inactiveClass}`}
      onClick={onClick}>
      {children}
    </button>
  )
}

interface MainContentProps {
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  cafes: Cafe[]
  totalItems: number
  sortBy: { distance: boolean; rating: boolean }
  onSortChange: (type: 'distance' | 'rating') => void
  userLocation: { lat: number; lng: number } | null
  showDistance: boolean
}

const MainContent: React.FC<MainContentProps> = ({
  currentPage,
  setCurrentPage,
  cafes,
  totalItems,
  sortBy,
  onSortChange,
  userLocation,
  showDistance,
}) => {
  const ITEMS_PER_PAGE = 10
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((curr) => curr - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((curr) => curr + 1)
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="flex-1">
      <div className="flex justify-center mb-8">
        <div className="bg-[#666] text-white px-12 py-3 rounded text-xl font-bold shadow-sm text-center relative">
          カフェ検索結果
        </div>
      </div>

      <div className="bg-[#D9D9D9] p-3 rounded mb-6 flex flex-col sm:flex-row items-center justify-between sm:justify-start gap-4 sm:gap-0">
        <span className="font-bold text-gray-700 mr-6 text-lg">並び替え</span>
        <div className="flex gap-4 sm:gap-8 w-full sm:w-auto">
          <button
            onClick={() => onSortChange('distance')}
            className={`flex-1 sm:flex-none px-8 py-1.5 rounded text-sm font-bold transition ${
              sortBy.distance
                ? 'bg-[#F26546] text-white'
                : 'bg-[#444] text-white hover:bg-[#555]'
            }`}>
            距離
          </button>
          <button
            onClick={() => onSortChange('rating')}
            className={`flex-1 sm:flex-none px-8 py-1.5 rounded text-sm font-bold transition ${
              sortBy.rating
                ? 'bg-[#F26546] text-white'
                : 'bg-[#444] text-white hover:bg-[#555]'
            }`}>
            評価
          </button>
        </div>
      </div>

      {cafes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {cafes.map((item) => (
            <CafeCard
              key={item.id}
              data={item}
              userLocation={userLocation}
              showDistance={showDistance}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
          <Search size={48} className="mb-4 text-gray-300" />
          <p className="text-lg font-bold">
            適切なカフェが見つかりませんでした。
          </p>
          <p className="text-sm">
            フィルターやキーワードを変更してお試しください。
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mb-8 mt-8 select-none">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationButton
              key={page}
              active={currentPage === page}
              onClick={() => handlePageClick(page)}>
              {page}
            </PaginationButton>
          ))}

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </main>
  )
}

interface SearchPageProps {
  initialKeyword?: string
}

const App: React.FC<SearchPageProps> = ({ initialKeyword = '' }) => {
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
    //Lọc theo Keyword
    const normalizedKeyword = initialKeyword.toLowerCase().trim()
    const matchSearch =
      !normalizedKeyword ||
      item.name.toLowerCase().includes(normalizedKeyword) ||
      item.address.toLowerCase().includes(normalizedKeyword)

    //Lọc theo Dropdown
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

    //Lọc theo giá
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
  }, [filters, initialKeyword, sortBy])

  const ITEMS_PER_PAGE = 10
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
      if (navigator.geolocation) {
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
      } else {
        setUserLocation({ lat: 21.0285, lng: 105.8542 })
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col font-sans w-full">
      <div className="w-full flex flex-col md:flex-row gap-8 p-4 md:px-8 md:py-8 relative">
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

export default App
