import { Link, useNavigate } from '@tanstack/react-router'
import { CheckCircle2, Search, User, X, MapPin } from 'lucide-react'
import { useAuthStore } from '../stores/useAuthStore'
import { Button } from '@/components/ui/button'
import logo from '/logo.png'
import { useState, useEffect, useRef } from 'react'

// Import data để gợi ý (Autocomplete)
import cafeDataRaw from '@/data/cafes.json'

// Định nghĩa lại interface Cafe gọn nhẹ cho việc gợi ý
interface CafeSimple {
  id: number
  name: string
  address: string
}

const CAFES_DATA: CafeSimple[] = cafeDataRaw as CafeSimple[]

export default function Header({
  isAuthenticated = false,
}: {
  isAuthenticated?: boolean
}) {
  const { signout } = useAuthStore()
  const navigate = useNavigate()

  // --- Search Logic State ---
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<CafeSimple[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // 1. Debounce Logic: Tìm gợi ý sau 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim()) {
        const lowerInput = inputValue.toLowerCase()
        const matched = CAFES_DATA.filter(
          (cafe) =>
            cafe.name.toLowerCase().includes(lowerInput) ||
            cafe.address.toLowerCase().includes(lowerInput),
        ).slice(0, 5) // Giới hạn 5 kết quả
        setSuggestions(matched)
        setShowSuggestions(true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue])

  // Ẩn gợi ý khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 2. Trigger Search: Điều hướng sang trang Search với params
  const handleTriggerSearch = (keyword: string) => {
    setShowSuggestions(false)
    // Điều hướng sang trang /search và gắn query param ?keyword=...
    navigate({
      to: '/search',
      search: { keyword: keyword },
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTriggerSearch(inputValue)
    }
  }

  const handleSuggestionClick = (cafeName: string) => {
    setInputValue(cafeName)
    handleTriggerSearch(cafeName)
  }

  const handleClear = () => {
    setInputValue('')
    setSuggestions([])
    // Tùy chọn: Nếu muốn clear xong về trang search trống thì uncomment dòng dưới
    // handleTriggerSearch('')
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FF6347] shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <img
            src={logo}
            alt="Coffee Match Logo"
            className="rounded-full size-10"
          />
          <span className="hidden sm:inline-block font-[Noto_Serif_JP] text-white text-xl font-bold">
            カフェマッチ
          </span>
        </Link>

        {/* --- SEARCH BAR --- */}
        <div className="flex-1 max-w-2xl relative" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => inputValue && setShowSuggestions(true)}
              placeholder="何をお探しですか？"
              className="w-full h-10 pl-4 pr-10 rounded-md bg-white/95 backdrop-blur-sm border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-200 placeholder:text-gray-500 text-gray-800"
            />
            {inputValue ? (
              <button
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1">
                <X size={16} />
              </button>
            ) : (
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 hover:bg-transparent">
                <Search size={18} />
              </Button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
              <ul>
                {suggestions.map((cafe) => (
                  <li
                    key={cafe.id}
                    onClick={() => handleSuggestionClick(cafe.name)}
                    className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-0 flex items-center gap-3 transition-colors text-left">
                    <Search size={16} className="text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-800 truncate">
                        {cafe.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                        <MapPin size={10} /> {cafe.address}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 hover:text-white gap-2 hidden md:flex">
            <CheckCircle2 size={16} />
            <span className="text-sm">終了済み</span>
          </Button>

          {isAuthenticated ? (
            <Button
              onClick={signout}
              variant="outline"
              size="sm"
              className="bg-white text-[#FF6347] border-white hover:bg-white/90 hover:text-[#FF6347] gap-2 cursor-pointer">
              <User size={16} />
              <span className="hidden sm:inline-block">ログアウト</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-[#FF6347] border-white hover:bg-white/90 hover:text-[#FF6347]">
              <Link to="/signin" className="flex items-center gap-2">
                <User size={16} />
                <span className="hidden sm:inline-block">ログイン</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
