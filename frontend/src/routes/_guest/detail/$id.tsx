import { createFileRoute } from '@tanstack/react-router'
import DetailPage from '@/components/DetailPage'

export const Route = createFileRoute('/_guest/detail/$id')({
  component: DetailPage,
})
