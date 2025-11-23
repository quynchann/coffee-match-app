import { Navigate, Outlet, createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '../stores/useAuthStore'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  const { accessToken, isAuthenticated } = useAuthStore()

  if (!accessToken || !isAuthenticated) {
    return <Navigate to="/signin" />
  }

  return <Outlet />
}
