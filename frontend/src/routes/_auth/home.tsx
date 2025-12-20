import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HomePage from '@/components/HomePage'

export const Route = createFileRoute('/_auth/home')({
  component: Home,
})

function Home() {
  return (
    <div className="text-center">
      <Header isAuthenticated={true} />
      <HomePage />
      <Footer />
    </div>
  )
}
