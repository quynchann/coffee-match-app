import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ProfilePage from '@/components/Profile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/profile')({
  component: Profile,
})

function Profile() {
  return (
    <>
      <Header isAuthenticated={true} />
      <ProfilePage />
      <Footer />
    </>
  )
}
