import React, { useRef, useState } from 'react'
import {
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
} from 'lucide-react'

/**
 * --- Định nghĩa các Interface (TypeScript) ---
 */
interface Cafe {
  id: number
  name: string
  location: string
  rating: number
  reviews: number
  image: string
  category: string
  comment: string
}

interface Theme {
  title: string
  description: string
  cafes: Array<Cafe>
}

/**
 * --- Dữ liệu mẫu (Hanoi Cafes) ---
 */
const ALL_CAFES: Array<Cafe> = [
  {
    id: 1,
    name: 'Cafe Giảng',
    location: 'Hoan Kiem, Hanoi',
    rating: 4.9,
    reviews: 2500,
    image:
      'https://images.unsplash.com/photo-1544787210-2213d84ad960?q=80&w=800&auto=format&fit=crop',
    category: 'デート',
    comment: 'Cà phê trứng huyền thoại.',
  },
  {
    id: 2,
    name: 'All Day Coffee',
    location: 'Hai Ba Trung, Hanoi',
    rating: 4.7,
    reviews: 840,
    image:
      'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=800&auto=format&fit=crop',
    category: '仕事',
    comment: 'Không gian làm việc lý tưởng.',
  },
  {
    id: 3,
    name: 'Tranquil Books & Coffee',
    location: 'Hoan Kiem, Hanoi',
    rating: 4.8,
    reviews: 620,
    image:
      'https://images.unsplash.com/photo-1521017432531-fbd92d744264?q=80&w=800&auto=format&fit=crop',
    category: '勉強',
    comment: 'Yên tĩnh để đọc sách.',
  },
  {
    id: 4,
    name: 'Cong Caphe',
    location: 'Trang Tien, Hanoi',
    rating: 4.6,
    reviews: 1200,
    image:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop',
    category: 'リラックス',
    comment: 'Cốt dừa đậu xanh đặc trưng.',
  },
  {
    id: 5,
    name: 'The Note Coffee',
    location: 'Hoan Kiem, Hanoi',
    rating: 4.8,
    reviews: 3500,
    image:
      'https://images.unsplash.com/photo-1507133750040-4a8f5700e53f?q=80&w=800&auto=format&fit=crop',
    category: 'デート',
    comment: 'Quán cà phê đầy những tờ giấy nhớ.',
  },
  {
    id: 6,
    name: 'Hidden Gem Coffee',
    location: 'Hang Tre, Hanoi',
    rating: 4.7,
    reviews: 500,
    image:
      'https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=800&auto=format&fit=crop',
    category: 'リラックス',
    comment: 'Tái chế độc đáo từ đồ phế liệu.',
  },
  {
    id: 7,
    name: 'Loading T',
    location: 'Ba Dinh, Hanoi',
    rating: 4.9,
    reviews: 420,
    image:
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop',
    category: '勉強',
    comment: 'Cà phê quế nồng nàn trong biệt thự cổ.',
  },
  {
    id: 8,
    name: "An's Cafe",
    location: 'Tay Ho, Hanoi',
    rating: 4.5,
    reviews: 210,
    image:
      'https://images.unsplash.com/photo-1497933322477-911893078d12?q=80&w=800&auto=format&fit=crop',
    category: '仕事',
    comment: 'View hồ Tây thoáng mát.',
  },
  {
    id: 9,
    name: 'Kafeville',
    location: 'Yen Ninh, Hanoi',
    rating: 4.7,
    reviews: 310,
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
    category: '仕事',
    comment: 'Cà phê đặc sản rang xay tại chỗ.',
  },
  {
    id: 10,
    name: 'Blackbird Coffee',
    location: 'Chan Cam, Hanoi',
    rating: 4.8,
    reviews: 550,
    image:
      'https://images.unsplash.com/photo-1501339819358-ee5f8b1403c6?q=80&w=800&auto=format&fit=crop',
    category: 'リラックス',
    comment: 'Tone màu cam đen ấm cúng.',
  },
]

const THEMES: Array<Theme> = [
  {
    title: 'ハノイのレトロな雰囲気',
    description: 'ハノイの歴史 và 時の流れを感じさせる、趣のあるカフェ。',
    cafes: [
      ALL_CAFES[0],
      ALL_CAFES[3],
      ALL_CAFES[5],
      ALL_CAFES[6],
      ALL_CAFES[4],
      ALL_CAFES[9],
    ],
  },
  {
    title: '現代的でスタイリッシュ',
    description: '会合にふさわしい、モダンで洗練された空間。',
    cafes: [
      ALL_CAFES[1],
      ALL_CAFES[7],
      ALL_CAFES[2],
      ALL_CAFES[8],
      ALL_CAFES[4],
      ALL_CAFES[0],
    ],
  },
]

/**
 * --- Component Card Chi Tiết ---
 */
interface CafeCardProps {
  cafe: Cafe
}

const CafeCard: React.FC<CafeCardProps> = ({ cafe }) => {
  const [isSaved, setIsSaved] = useState<boolean>(false)

  return (
    <div className="flex-none w-[260px] sm:w-[280px] lg:w-[230px] xl:w-[245px] bg-white group cursor-pointer transition-all duration-300">
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl mb-3 shadow-sm">
        <img
          src={cafe.image}
          alt={cafe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const target = e.target as HTMLImageElement
            target.src =
              'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop'
          }}
        />

        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation()
            setIsSaved(!isSaved)
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm z-10 ${
            isSaved
              ? 'bg-orange-500 text-white scale-110 shadow-orange-200'
              : 'bg-white/80 text-slate-400 hover:text-orange-500 hover:bg-white'
          }`}>
          {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>

        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-orange-500/90 backdrop-blur-md text-white text-[9px] font-bold rounded-md uppercase tracking-wider">
          {cafe.category}
        </div>
      </div>

      <div className="space-y-1.5 px-1">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 line-clamp-1 leading-tight group-hover:text-orange-600 transition-colors">
              {cafe.name}
            </h3>
          </div>

          <div className="flex items-center text-orange-500 shrink-0 mt-0.5">
            <span className="text-xs font-bold mr-0.5">{cafe.rating}</span>
            <Star size={10} fill="currentColor" />
          </div>
        </div>

        <div className="flex items-center text-slate-500 text-[11px] gap-1 pt-0.5">
          <MapPin size={10} className="shrink-0 text-slate-400" />
          <span className="line-clamp-1">{cafe.location}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * --- Component Slider ---
 */
interface CafeRowProps {
  cafes: Array<Cafe>
}

const CafeRow: React.FC<CafeRowProps> = ({ cafes }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right'): void => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth

      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="relative group/row">
      <button
        onClick={() => scroll('left')}
        className="absolute -left-3 lg:-left-6 top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl border border-orange-100 p-3 rounded-full text-slate-600 hover:bg-orange-500 hover:text-white transition-all opacity-0 group-hover/row:opacity-100 hidden md:flex items-center justify-center scale-90 hover:scale-100">
        <ChevronLeft size={22} strokeWidth={2.5} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 lg:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {cafes.map((cafe, idx) => (
          <div key={`${cafe.id}-${idx}`} className="snap-start">
            <CafeCard cafe={cafe} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="absolute -right-3 lg:-right-6 top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl border border-orange-100 p-3 rounded-full text-slate-600 hover:bg-orange-500 hover:text-white transition-all opacity-0 group-hover/row:opacity-100 hidden md:flex items-center justify-center scale-90 hover:scale-100">
        <ChevronRight size={22} strokeWidth={2.5} />
      </button>
    </div>
  )
}

/**
 * --- Main Content ---
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] py-12 font-sans text-slate-900 overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto px-6 space-y-12">
        {/* Khối: おすすめ (Recommended) */}
        <section className="bg-white border-2 border-orange-500/20 rounded-[40px] p-6 lg:p-10 shadow-sm shadow-orange-100/50 transition-all hover:border-orange-500/40">
          <div className="flex items-center justify-between mb-8 pb-2">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-orange-500 tracking-tight flex items-center gap-2">
                おすすめ
              </h2>
            </div>
          </div>

          <CafeRow cafes={ALL_CAFES} />
        </section>

        {/* Khối: Themes */}
        <div className="space-y-12">
          {THEMES.map((theme, idx) => (
            <section
              key={`theme-sec-${idx}`}
              className="bg-white border-2 border-orange-500/20 rounded-[40px] p-6 lg:p-10 shadow-sm shadow-orange-100/50 transition-all hover:border-orange-500/40">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-orange-500">
                      {theme.title}
                    </h3>
                    <p className="text-[12px] text-slate-400 font-medium uppercase tracking-wider mt-1">
                      {theme.description}
                    </p>
                  </div>
                </div>
              </div>

              <CafeRow cafes={theme.cafes} />
            </section>
          ))}
        </div>

        <div className="h-10"></div>
      </div>
    </div>
  )
}
