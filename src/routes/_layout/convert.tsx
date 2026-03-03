import { createFileRoute } from '@tanstack/react-router'
import { ConvertPage } from '@/pages/convert'

export const Route = createFileRoute('/_layout/convert')({
  component: ConvertPage,
})
