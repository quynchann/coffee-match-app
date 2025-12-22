import { createFileRoute } from '@tanstack/react-router'
import FavoritePage from '@/components/FavoritePage'

export const Route = createFileRoute('/_auth/favorite')({
  component: FavoritePage,
})
