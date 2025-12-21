import { createFileRoute } from '@tanstack/react-router'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import FavoritePage from '@/components/FavoritePage'

export const Route = createFileRoute('/_auth/favorite')({
  component: Favorite,
})

function Favorite() {
  return (
    <>
      <Header />
      <FavoritePage />
      <Footer />
    </>
  )
}
