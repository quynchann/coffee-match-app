import { useNavigate } from '@tanstack/react-router'
import { Bookmark, ImageIcon, Star } from 'lucide-react'

const AREAS = [
  { id: 'hbt', label: 'Hai Ba Trung', jpLabel: 'ハイバーチュン区' },
  { id: 'hk', label: 'Hoan Kiem', jpLabel: 'ホアンキエム区' },
  { id: 'cg', label: 'Cau Giay', jpLabel: 'カウザイ区' },
  { id: 'bd', label: 'Ba Dinh', jpLabel: 'バーディン区' },
]

const CafeCard: React.FC<{
  data: IShop
  userLocation: { lat: number; lng: number } | null
  showDistance: boolean
  isFavorite: boolean
  handleToggle: (id: string) => void
}> = ({ data, userLocation, showDistance, isFavorite, handleToggle }) => {
  const navigate = useNavigate()
  const areaInfo = AREAS.find((a) => a.id === data.area)

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
    userLocation && data.location.coordinates[0] && data.location.coordinates[1]
      ? calculateDistance(
          userLocation.lat,
          userLocation.lng,
          data.location.coordinates[1],
          data.location.coordinates[0],
        )
      : null

  const formatDistance = (distKm: number): string => {
    if (distKm < 1) {
      return `${Math.round(distKm * 1000)}m`
    }
    return `${distKm.toFixed(1)}km`
  }

  const displayImage = data.images.length > 0 ? data.images[0] : null

  const handleClick = () => {
    navigate({ to: '/detail/$id', params: { id: String(data._id) } })
  }

  return (
    <div
      onClick={handleClick}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative flex h-40 shrink-0 items-center justify-center overflow-hidden bg-gray-200">
        {displayImage ? (
          <img
            src={displayImage}
            alt={data.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <ImageIcon
            size={48}
            className="text-gray-400 transition duration-500 group-hover:scale-110"
          />
        )}

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleToggle(data._id)
          }}
          className={`absolute top-2 right-2 rounded-full p-1 shadow-sm transition ${
            isFavorite ? 'bg-white text-[#F26546]' : 'bg-white text-gray-400'
          }`}>
          <Bookmark size={16} fill={isFavorite ? '#F26546' : 'white'} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="mb-1 flex items-start justify-between">
          <h3 className="line-clamp-1 text-lg font-bold text-gray-800">
            {data.name}
          </h3>
          <div className="flex shrink-0 items-center gap-1">
            <span className="text-lg font-bold text-gray-700">
              {data.rating}
            </span>
            <Star size={16} className="text-[#F26546]" fill="#F26546" />
          </div>
        </div>

        <div className="mt-auto space-y-1 text-xs text-gray-600">
          <p className="text-left">
            営業時間: {data.hours.open} ~ {data.hours.close}
          </p>
          <p className="line-clamp-1 text-left">住所: {data.address}</p>
          <p className="text-left font-semibold text-gray-500">
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

export default CafeCard
