import { createFileRoute } from '@tanstack/react-router'
import logo from '/logo.svg'
import Header from '@/components/Header'

export const Route = createFileRoute('/_auth/home')({
  component: Home,
})

function Home() {
  return (
    <div className="text-center">
      <Header />
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <img
          src={logo}
          className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <p>Welcome to the Home Page!</p>
      </header>
    </div>
  )
}
