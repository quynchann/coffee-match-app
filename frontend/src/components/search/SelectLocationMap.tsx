import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'
import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface Position {
  lat: number
  lng: number
  address: string
}

interface Props {
  onConfirm: (lat: number, lng: number, address: string) => void
  onClose: () => void
}

// 住所を取得（リバースジオコーディング）
async function getAddress(lat: number, lng: number): Promise<string> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
  )
  const data = await res.json()
  return data.display_name || ''
}

function MapController({
  position,
  setPosition,
}: {
  position: Position | null
  setPosition: React.Dispatch<React.SetStateAction<Position | null>>
}) {
  const map = useMap()

  useMapEvents({
    async click(e) {
      const address = await getAddress(e.latlng.lat, e.latlng.lng)

      setPosition({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        address,
      })
    },
  })

  if (position) {
    map.setView([position.lat, position.lng], 15)
  }

  return null
}

export default function SelectLocationMap({ onConfirm, onClose }: Props) {
  const [position, setPosition] = useState<Position | null>(null)
  const [keyword, setKeyword] = useState('')

  const searchAddress = async () => {
    if (!keyword) return

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        keyword,
      )}&limit=1`,
    )
    const data = await res.json()

    if (data.length > 0) {
      setPosition({
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        address: data[0].display_name,
      })
    } else {
      alert('住所が見つかりませんでした')
    }
  }

  return (
    <div className="relative">
      <Button
        variant="icon"
        onClick={onClose}
        className="absolute top-2 right-2 z-1000 rounded-full p-2 text-gray-600"
        aria-label="close">
        <X />
      </Button>

      <div className="flex gap-3 p-4">
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="住所を入力してください（例：渋谷区）"
          className="w-75"
        />
        <Button variant="blue" onClick={searchAddress}>
          検索
        </Button>
      </div>

      <MapContainer center={[21.03, 105.85]} zoom={13} className="h-100 w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapController position={position} setPosition={setPosition} />

        {position && (
          <Marker position={[position.lat, position.lng]} icon={markerIcon}>
            <Popup closeButton autoClose={false}>
              {position.address}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <div className="p-4">
        <Button
          variant="primary"
          disabled={!position}
          onClick={() =>
            position && onConfirm(position.lat, position.lng, position.address)
          }>
          この場所を確定
        </Button>
      </div>
    </div>
  )
}
