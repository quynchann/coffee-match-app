import { createFileRoute } from '@tanstack/react-router'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ProfilePage from '@/components/Profile'

export const Route = createFileRoute('/_auth/profile')({
  component: Profile,
})

function Profile() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ProfilePage />
      </main>
      <Footer />
    </div>
  )
}
