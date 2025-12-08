import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  Home,
  Bookmark,
  User,
  ChevronDown,
  ChevronUp,
  Star,
  Instagram,
  Facebook,
  Twitter,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin,
  Clock,
  Phone,
  Share2,
  Flag,
  Send,
  Upload,
  Camera,
  Wifi,
  Car,
  Coffee,
  Dog,
  Volume2,
} from 'lucide-react'

// --- Interfaces & Types ---

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

interface Cafe {
  id: number
  name: string
  rating: number
  hours: string
  address: string
  area: string
  purpose: string
  description?: string
  phone?: string
  features?: string[]
  images?: string[]
  menu?: { name: string; price: string; image?: string }[]
  reviews?: {
    id: number
    user: string
    date: string
    rating: number
    content: string
    image?: string
  }[]
}

interface Filters {
  area: string | null
  purpose: string | null
}

// --- Constants & Mock Data ---

const AREAS: Area[] = [
  { id: 'hbt', label: 'Hai Bà Trưng', jpLabel: 'ハイバーチュン区' },
  { id: 'hk', label: 'Hoàn Kiếm', jpLabel: 'ホアンキエム区' },
  { id: 'cg', label: 'Cầu Giấy', jpLabel: 'カウザイ区' },
  { id: 'bd', label: 'Ba Đình', jpLabel: 'バーディン区' },
]

const PURPOSES: Purpose[] = [
  { id: 'study', label: 'Học tập', jpLabel: '勉強' },
  { id: 'work', label: 'Công việc', jpLabel: '仕事' },
  { id: 'date', label: 'Hẹn hò', jpLabel: 'デート' },
  { id: 'relax', label: 'Thư giãn', jpLabel: 'リラックス' },
]

// Dữ liệu chi tiết mẫu cho trang Detail
const MOCK_DETAIL_DATA = {
  description:
    'ロレム・イプサム・ドロル・シット・アメット──選り抜かれた人々と共に楽しみ、豊かな知識を身につけることができる。深い洞察を求める者は多く、時に鋭い意見の衝突も起こる。そこには苦悩もあるが、前へ進むことで答えが見えてくる。努力することで、人は成長できるのである。',
  phone: '090-1234-5678',
  features: [
    '高速無料Wi-Fi完備', // Có Wifi miễn phí tốc độ cao
    '静かで作業に最適な空間', // Không gian yên tĩnh phù hợp làm việc
    'バイク・車 駐車場あり', // Có chỗ đỗ xe máy/ô tô
    '軽食サービスあり', // Phục vụ đồ ăn nhẹ
    'ペット同伴可 (テラス席)', // Cho phép mang thú cưng (khu vực ngoài trời)
  ],
  images: [1, 2, 3, 4, 5, 6].map((i) => `Image ${i}`),
  menu: [
    { name: 'コンボ 1', price: '199K' },
    { name: 'コンボ 2', price: '199K' },
    { name: 'コンボ 3', price: '199K' },
    { name: 'コンボ 4', price: '199K' },
    { name: 'コンボ 5', price: '199K' },
    { name: 'コンボ 6', price: '199K' },
  ],
  reviews: [
    {
      id: 1,
      user: 'User Name 1',
      date: '25/10/2025',
      rating: 4,
      content:
        'お店はとても綺麗で、飲み物も美味しかったです。スタッフの対応も熱心でした。また来ます！',
      image: 'Review Image',
    },
  ],
}

const MOCK_DATA: Cafe[] = [
  {
    id: 1,
    name: 'Highlands Coffee',
    rating: 4.5,
    hours: '7:00 ~ 23:00',
    address: '16 Le Thanh Nghi',
    area: 'hbt',
    purpose: 'study',
    ...MOCK_DETAIL_DATA,
  },
  {
    id: 2,
    name: 'The Coffee House',
    rating: 4.8,
    hours: '8:00 ~ 22:30',
    address: '23 Ba Trieu',
    area: 'hk',
    purpose: 'work',
    ...MOCK_DETAIL_DATA,
  },
  {
    id: 3,
    name: 'Starbucks Indochina',
    rating: 4.9,
    hours: '7:30 ~ 22:00',
    address: '241 Xuan Thuy',
    area: 'cg',
    purpose: 'work',
    ...MOCK_DETAIL_DATA,
  },
  {
    id: 4,
    name: 'All Day Coffee',
    rating: 4.6,
    hours: '8:00 ~ 23:00',
    address: '37 Quang Trung',
    area: 'hk',
    purpose: 'date',
    ...MOCK_DETAIL_DATA,
  },
  {
    id: 5,
    name: 'Tranquil Books',
    rating: 5.0,
    hours: '8:00 ~ 22:00',
    address: '5 Nguyen Quang Bich',
    area: 'hk',
    purpose: 'study',
    ...MOCK_DETAIL_DATA,
  },
  {
    id: 6,
    name: 'Cộng Cà Phê',
    rating: 4.4,
    hours: '7:00 ~ 23:30',
    address: '116 Cau Go',
    area: 'hk',
    purpose: 'relax',
    ...MOCK_DETAIL_DATA,
  },
  {
    id: 7,
    name: 'Là Việt Coffee',
    rating: 4.7,
    hours: '7:00 ~ 22:00',
    address: '3 Ngo Quyen',
    area: 'hk',
    purpose: 'work',
    ...MOCK_DETAIL_DATA,
  },
  {
    id: 8,
    name: 'Phúc Long',
    rating: 4.2,
    hours: '8:00 ~ 22:00',
    address: '82 Hang Dieu',
    area: 'hk',
    purpose: 'relax',
    ...MOCK_DETAIL_DATA,
  },
  {
    id: 9,
    name: 'Maison de Blanc',
    rating: 4.8,
    hours: '9:00 ~ 21:00',
    address: '5 Tay Ho',
    area: 'bd',
    purpose: 'date',
    ...MOCK_DETAIL_DATA,
  },
  {
    id: 10,
    name: 'Twitter Beans',
    rating: 4.3,
    hours: '7:00 ~ 22:00',
    address: '56 Vu Trong Phung',
    area: 'cg',
    purpose: 'study',
    ...MOCK_DETAIL_DATA,
  },
  {
    id: 11,
    name: 'Kafa Café',
    rating: 4.1,
    hours: '7:00 ~ 23:00',
    address: '101 Ba Trieu',
    area: 'hbt',
    purpose: 'relax',
    ...MOCK_DETAIL_DATA,
  },
]

// --- Shared Components ---

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F26546] text-white py-4 mt-auto relative z-10 w-full">
      <div className="w-full px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xl font-bold border-2 border-white px-2 py-0.5">
          ロゴ
        </div>

        <div className="text-xs">
          © 2025 Your Website. All rights reserved.
        </div>

        <div className="flex gap-4">
          <Instagram size={20} className="cursor-pointer hover:text-gray-200" />
          <Facebook size={20} className="cursor-pointer hover:text-gray-200" />
          <Twitter size={20} className="cursor-pointer hover:text-gray-200" />
        </div>
      </div>
    </footer>
  )
}

// --- Search Page Components ---

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
            -- Tất cả / Hủy lọc --
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

const FilterSidebar: React.FC<{
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
}> = ({ filters, setFilters }) => {
  const toggleBtnClass =
    'w-full bg-[#444444] text-white py-2.5 px-4 rounded mb-3 text-sm font-bold hover:bg-[#555] transition flex items-center justify-center gap-2'

  return (
    <aside className="w-full md:w-64 flex-shrink-0 space-y-6 md:sticky md:top-24 h-fit">
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
            <span className="absolute left-2 top-2 text-gray-500 text-xs">
              ¥
            </span>
            <input
              type="text"
              placeholder="から"
              className="w-full border border-gray-300 rounded px-2 py-1.5 pl-5 text-sm focus:outline-none focus:border-[#F26546]"
            />
          </div>
          <span className="text-gray-500">~</span>
          <div className="relative flex-1">
            <span className="absolute left-2 top-2 text-gray-500 text-xs">
              ¥
            </span>
            <input
              type="text"
              placeholder="まで"
              className="w-full border border-gray-300 rounded px-2 py-1.5 pl-5 text-sm focus:outline-none focus:border-[#F26546]"
            />
          </div>
        </div>
        <button className="w-full bg-[#FF7F50] text-white font-bold py-2 rounded mb-6 hover:opacity-90 transition shadow-sm">
          適用
        </button>
        <button className={toggleBtnClass}>Wi-Fiあり</button>
        <button className={toggleBtnClass}>子どもOK</button>
        <button className={toggleBtnClass}>静か</button>
      </div>
    </aside>
  )
}

const CafeCard: React.FC<{ data: Cafe; onClick: () => void }> = ({
  data,
  onClick,
}) => {
  const areaInfo = AREAS.find((a) => a.id === data.area)
  const purposeInfo = PURPOSES.find((p) => p.id === data.purpose)

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group h-full flex flex-col cursor-pointer">
      <div className="h-40 bg-gray-200 relative flex items-center justify-center overflow-hidden flex-shrink-0">
        <ImageIcon
          size={48}
          className="text-gray-400 group-hover:scale-110 transition duration-500"
        />
        <div className="absolute top-2 right-2 text-[#F26546] bg-white rounded-full p-1 shadow-sm">
          <Bookmark size={16} fill="#F26546" />
        </div>
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
          <p>営業時間: {data.hours}</p>
          <p className="line-clamp-1">住所: {data.address}</p>
          <p className="font-semibold text-gray-500">
            {areaInfo ? `${areaInfo.jpLabel} (${areaInfo.label})` : 'Hanoi'}
          </p>
        </div>
      </div>
    </div>
  )
}

// --- Detail Page Components (Beautified & Full Screen Optimized) ---

const SectionCard: React.FC<{
  title: string
  children: React.ReactNode
  icon?: React.ReactNode
}> = ({ title, children, icon }) => {
  return (
    <div className="relative mt-8 group w-full">
      <div className="absolute -top-4 left-6 bg-white px-3 py-1 flex items-center gap-2 z-10 border border-[#F26546]/20 rounded-full shadow-sm">
        {icon && <span className="text-[#F26546]">{icon}</span>}
        <h2 className="font-bold text-[#F26546] text-sm md:text-base tracking-wide">
          {title}
        </h2>
      </div>
      <div className="bg-white rounded-xl border border-[#F26546]/30 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 w-full">
        {children}
      </div>
    </div>
  )
}

const FeatureItem: React.FC<{ text: string }> = ({ text }) => {
  let Icon = Check
  if (text.includes('Wi-Fi')) Icon = Wifi
  if (text.includes('駐車場')) Icon = Car
  if (text.includes('軽食')) Icon = Coffee
  if (text.includes('ペット')) Icon = Dog
  if (text.includes('静か')) Icon = Volume2

  return (
    <li className="flex items-center gap-3 p-3 rounded-lg bg-orange-50/50 border border-orange-100/50 hover:bg-orange-50 transition-colors">
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#F26546] border border-orange-100 flex-shrink-0">
        <Icon size={16} />
      </div>
      <span className="text-sm font-medium text-gray-700">{text}</span>
    </li>
  )
}

const DetailView: React.FC<{ cafe: Cafe }> = ({ cafe }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    if (cafe.images && cafe.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % cafe.images!.length)
    }
  }

  const prevImage = () => {
    if (cafe.images && cafe.images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + cafe.images!.length) % cafe.images!.length,
      )
    }
  }

  return (
    <div className="w-full p-4 md:p-8 space-y-8 bg-white md:bg-transparent">
      {/* 1. Hero Section - Card hóa */}
      <div className="bg-white md:rounded-xl md:shadow-md md:p-8 border border-gray-100 overflow-hidden w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Image Carousel */}
          <div className="w-full md:w-1/2 aspect-video bg-gray-100 rounded-lg relative group overflow-hidden border border-gray-100">
            <div className="w-full h-full flex items-center justify-center bg-gray-200 relative">
              <ImageIcon size={64} className="text-gray-400" />
              <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none">
                {/* Mock Text to show index changing */}
                <span className="bg-white/80 px-3 py-1 rounded text-xs font-bold text-gray-600 mt-20">
                  {cafe.images && cafe.images[currentImageIndex]}
                </span>
              </div>
            </div>

            {/* Navigation Buttons */}
            {cafe.images && cafe.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100">
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100">
                  <ChevronRight size={24} />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {cafe.images.map((_, idx) => (
                    <div
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer shadow-sm ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/60 hover:bg-white'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center space-y-5">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight text-left">
                {cafe.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={18}
                      className={
                        s <= Math.round(cafe.rating)
                          ? 'text-[#F26546] fill-[#F26546]'
                          : 'text-gray-200'
                      }
                    />
                  ))}
                </div>
                <span className="text-gray-500 text-sm font-medium">
                  (4.8/5.0 - 120 レビュー)
                </span>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed text-sm md:text-base border-l-4 border-[#F26546] pl-4 italic bg-gray-50 py-2 rounded-r text-left">
              {cafe.description}
            </p>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition">
                <MapPin size={20} className="text-[#F26546]" />
                <span className="font-medium">{cafe.address}</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition">
                <Clock size={20} className="text-[#F26546]" />
                <span className="font-medium">{cafe.hours}</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition">
                <Phone size={20} className="text-[#F26546]" />
                <span className="font-medium">
                  {cafe.phone || '090-XXXX-XXXX'}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100 justify-center">
              <button className="w-48 flex items-center justify-center gap-2 bg-[#F26546] text-white py-3 rounded-lg font-bold hover:bg-[#e05535] transition shadow-sm shadow-orange-200">
                <Bookmark size={18} /> 保存
              </button>
              <button className="w-48 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition">
                <Share2 size={18} /> 共有
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Features - Optimized Grid for Full Screen (3 cols on lg, 4 on xl) */}
      <SectionCard title="お店の機能" icon={<Check size={18} />}>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cafe.features?.map((feature, idx) => (
            <FeatureItem key={idx} text={feature} />
          ))}
        </ul>
      </SectionCard>

      {/* 3. Photos - Optimized Grid for Full Screen */}
      <SectionCard title="お店の写真" icon={<Camera size={18} />}>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {cafe.images?.map((img, idx) => (
            <div
              key={idx}
              className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer group border border-gray-100 shadow-sm hover:shadow-md transition">
              <ImageIcon
                size={32}
                className="text-gray-300 group-hover:scale-125 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 4. Menu - Optimized Grid for Full Screen */}
      <SectionCard title="お店のメニュー" icon={<Coffee size={18} />}>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {cafe.menu?.map((item, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-lg p-2 border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="aspect-video bg-gray-50 rounded-md flex items-center justify-center relative overflow-hidden mb-2">
                <span className="absolute top-2 right-2 text-xs font-bold bg-[#F26546] text-white px-2 py-0.5 rounded-full shadow-sm">
                  {item.price}
                </span>
                <ImageIcon
                  size={32}
                  className="text-gray-300 group-hover:scale-110 transition"
                />
              </div>
              <p className="text-center text-sm font-bold text-gray-700 group-hover:text-[#F26546] transition">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 5. Review Form & List */}
      <SectionCard title="カフェの評価" icon={<Star size={18} />}>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8 w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                <User size={20} />
              </div>
              <div>
                <span className="font-bold text-sm block text-gray-800 text-left">
                  User Name
                </span>
                <span className="text-xs text-gray-500">レビューを書く</span>
              </div>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={24}
                  className="text-gray-300 hover:text-[#F26546] cursor-pointer transition-colors"
                />
              ))}
            </div>
          </div>

          <div className="relative">
            <textarea
              className="w-full border border-gray-200 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#F26546]/20 focus:border-[#F26546] min-h-[100px] bg-white transition-all shadow-inner"
              placeholder="このカフェはどうでしたか？"
            />
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button className="p-2 text-gray-400 hover:text-[#F26546] hover:bg-orange-50 rounded-full transition">
                <Upload size={20} />
              </button>
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <button className="bg-[#444] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#222] transition shadow-sm hover:shadow">
              送信
            </button>
          </div>
        </div>

        <div className="space-y-6 w-full">
          {cafe.reviews?.map((review) => (
            <div
              key={review.id}
              className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold border border-gray-200">
                    {review.user.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-gray-800 block text-left">
                      {review.user}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            className={
                              s <= review.rating
                                ? 'text-[#F26546] fill-[#F26546]'
                                : 'text-gray-200'
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 font-medium">
                        | {review.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ml-13 pl-13">
                <div className="w-20 h-20 bg-gray-50 rounded-lg mb-3 flex items-center justify-center border border-gray-100">
                  <ImageIcon size={20} className="text-gray-300" />
                </div>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-50 text-left">
                  {review.content}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <button className="text-sm font-bold text-[#F26546] hover:text-[#d14428] hover:underline transition">
            すべてのレビューを見る
          </button>
        </div>
      </SectionCard>
    </div>
  )
}

// --- Main App Logic ---

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'search' | 'detail'>('detail')
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(MOCK_DATA[0])
  const [filters, setFilters] = useState<Filters>({ area: null, purpose: null })
  const [currentPage, setCurrentPage] = useState<number>(1)

  // Logic Search
  const filteredData = MOCK_DATA.filter((item) => {
    const matchArea = filters.area ? item.area === filters.area : true
    const matchPurpose = filters.purpose
      ? item.purpose === filters.purpose
      : true
    return matchArea && matchPurpose
  })
  const ITEMS_PER_PAGE = 10
  const currentItems = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)

  const handleCafeClick = (cafe: Cafe) => {
    setSelectedCafe(cafe)
    setCurrentView('detail')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleHomeClick = () => {
    setCurrentView('search')
    setSelectedCafe(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col font-sans w-full text-gray-800">
      {currentView === 'search' ? (
        <div className="w-full flex flex-col md:flex-row gap-8 p-4 md:px-8 md:py-8 relative">
          <FilterSidebar filters={filters} setFilters={setFilters} />
          <main className="flex-1">
            <div className="flex justify-center mb-8">
              <div className="bg-[#666] text-white px-12 py-3 rounded text-xl font-bold shadow-sm text-center">
                カフェ検索結果
              </div>
            </div>
            {/* Sort Bar (Simplified) */}
            <div className="bg-[#D9D9D9] p-3 rounded mb-6 flex items-center justify-between">
              <span className="font-bold text-gray-700 mr-6 text-lg">
                並び替え
              </span>
              <div className="flex gap-4">
                <button className="bg-[#444] text-white px-8 py-1.5 rounded text-sm font-bold">
                  距離
                </button>
              </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
              {currentItems.map((item) => (
                <CafeCard
                  key={item.id}
                  data={item}
                  onClick={() => handleCafeClick(item)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                  className="p-2 bg-white border rounded">
                  <ChevronLeft size={16} />
                </button>
                <span className="p-2 bg-[#F26546] text-white rounded w-9 h-9 flex items-center justify-center font-bold">
                  {currentPage}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((c) => Math.min(totalPages, c + 1))
                  }
                  className="p-2 bg-white border rounded">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </main>
        </div>
      ) : (
        // DETAIL VIEW
        selectedCafe && <DetailView cafe={selectedCafe} />
      )}
    </div>
  )
}

export default App
