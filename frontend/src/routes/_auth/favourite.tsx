import { createFileRoute } from '@tanstack/react-router'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import FavoritePage from '@/components/FavouritePage'

export const Route = createFileRoute('/_auth/favourite')({
  component: Favorite,
})

function Favorite() {
  return (
    <>
      <Header isAuthenticated={true} />
      <FavoritePage />
      <Footer />
    </>
  )
}
