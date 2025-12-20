import { Link } from '@tanstack/react-router'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import logo from '/logo.png'

const links = [
  {
    name: 'Facebook',
    icon: Facebook,
    href: '#',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    href: '#',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    href: '#',
  },
]

export default function Footer() {
  const { isAuthenticated } = useAuthStore()

  return (
    <footer className="w-full bg-[#FF6347] px-12 py-3 text-white">
      <div className="flex justify-between pt-3">
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

        <div className="flex items-center gap-10">
          {links.map((link) => (
            <Link to={link.href} key={link.name} className="hover:opacity-80">
              <link.icon />
            </Link>
          ))}
        </div>
      </div>
      <p className="text-center text-sm text-white">
        © 2025 Cafe Match. All rights reserved.
      </p>
    </footer>
  )
}
