import React, {useEffect, useState } from 'react'
import MainDetail from './detail/MainDetail'
import type { Cafe } from '@/types/cafe'
import cafeDataRaw from '@/data/cafes.json'


const CAFES_DATA: Array<Cafe> = cafeDataRaw as Array<Cafe>

const DetailPage: React.FC = () => {
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null)

  useEffect(() => {
    // Lấy ID từ URL (query param ?id=...)
    const params = new URLSearchParams(window.location.search)
    const idParam = params.get('id')

    if (idParam) {
      const foundCafe = CAFES_DATA.find((c) => c.id === Number(idParam))
      if (foundCafe) {
        setSelectedCafe(foundCafe)
      } else {
        // Fallback nếu ID không tồn tại: Chọn quán đầu tiên
        setSelectedCafe(CAFES_DATA[0])
      }
    } else {
      // Fallback nếu không có ID: Chọn quán đầu tiên
      setSelectedCafe(CAFES_DATA[0])
    }
  }, [])

  if (!selectedCafe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col font-sans w-full text-gray-800">
      <MainDetail cafe={selectedCafe} />
    </div>
  )
}

export default DetailPage
