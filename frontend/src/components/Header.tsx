import { Link } from '@tanstack/react-router'
import { CheckCircle2, Search, User } from 'lucide-react'
import { useAuthStore } from '../stores/useAuthStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import logo from '/logo.png'

export default function Header({
  isAuthenticated = false,
}: {
  isAuthenticated?: boolean
}) {
  const { signout } = useAuthStore()

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FF6347] shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-6">
        {/* Logo Section */}
        <Link
          to="/home"
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

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative">
          <Input
            type="text"
            placeholder="何をお探しですか？"
            className="h-10 pr-10 bg-white/95 backdrop-blur-sm border-white/30 focus-visible:border-white focus-visible:ring-white/30 placeholder:text-gray-500"
          />
          <Button
            size="icon-sm"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 hover:bg-transparent">
            <Search size={18} />
          </Button>
        </div>

        {/* Right Section - Navigation */}
        <div className="flex items-center gap-2">
          {/* Finished Items Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 hover:text-white gap-2 hidden md:flex">
            <CheckCircle2 size={16} />
            <span className="text-sm">終了済み</span>
          </Button>

          {/* User Login/Profile */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white text-[#FF6347] border-white hover:bg-white/90 hover:text-[#FF6347] gap-2 cursor-pointer">
                  <User size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/profile" className="w-full block">
                    プロフィール
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signout}>
                  ログアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
