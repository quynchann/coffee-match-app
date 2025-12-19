import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { CheckCircle2, LogIn, MapPin, Search, User, X } from 'lucide-react'
import { useAuthStore } from '../stores/useAuthStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import logo from '/logo.png'

// Import data để gợi ý (Autocomplete)
import cafeDataRaw from '@/data/cafes.json'

// Định nghĩa lại interface Cafe gọn nhẹ cho việc gợi ý
interface CafeSimple {
  id: number
  name: string
  address: string
}

const CAFES_DATA: Array<CafeSimple> = cafeDataRaw as Array<CafeSimple>

export default function Header({
  isAuthenticated = false,
}: {
  isAuthenticated?: boolean
}) {
  const { signout } = useAuthStore()
  const navigate = useNavigate()

  // --- Search Logic State ---
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<Array<CafeSimple>>([])
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
          to={isAuthenticated ? '/home' : '/'}
          className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <img
            src={logo}
            alt="Coffee Match Logo"
            className="size-10 rounded-full"
          />
          <span className="hidden font-[Noto_Serif_JP] text-xl font-bold text-white sm:inline-block">
            カフェマッチ
          </span>
        </Link>

        {/* --- SEARCH BAR --- */}
        <div className="relative max-w-2xl flex-1" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => inputValue && setShowSuggestions(true)}
              placeholder="何をお探しですか？"
              className="h-10 w-full rounded-md border-white/30 bg-white/95 pr-10 pl-4 text-gray-800 backdrop-blur-sm placeholder:text-gray-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
            />
            {inputValue ? (
              <button
                onClick={handleClear}
                className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700">
                <X size={16} />
              </button>
            ) : (
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-1/2 right-1 -translate-y-1/2 text-gray-600 hover:bg-transparent hover:text-gray-800">
                <Search size={18} />
              </Button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="animate-in fade-in zoom-in-95 absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl duration-100">
              <ul>
                {suggestions.map((cafe) => (
                  <li
                    key={cafe.id}
                    onClick={() => handleSuggestionClick(cafe.name)}
                    className="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-0 hover:bg-orange-50">
                    <Search size={16} className="shrink-0 text-gray-400" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-gray-800">
                        {cafe.name}
                      </div>
                      <div className="flex items-center gap-1 truncate text-xs text-gray-500">
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
            className="hidden gap-2 text-white hover:bg-white/20 hover:text-white md:flex">
            <CheckCircle2 size={16} />
            <span className="text-sm">終了済み</span>
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-white text-[#FF6347] hover:bg-white/90 hover:text-[#FF6347]">
                  <User size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/profile" className="block w-full">
                    プロフィール
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signout}>
                  ログアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="bg-white text-[#FF6347] hover:bg-white/90 hover:text-[#FF6347]">
              <Link to="/signin" className="flex items-center gap-2">
                <LogIn />
                <span className="hidden sm:inline-block">ログイン</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
