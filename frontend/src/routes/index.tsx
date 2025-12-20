import { createFileRoute } from '@tanstack/react-router'
import logo from '/logo.svg'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center bg-[#282c34] text-[calc(10px+2vmin)] text-white">
        <img
          src={logo}
          className="pointer-events-none h-[40vmin] animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <p>Welcome to the Index Page!</p>
      </main>
      <Footer />
    </div>
  )
}
