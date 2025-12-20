import { useState } from 'react'
import { Bookmark, Check, Clock, MapPin, Star, Trash2 } from 'lucide-react'
// Cập nhật đường dẫn import đến thư mục data
import CAFE_DATA from '../data/cafes.json'

// --- Types & Interfaces ---
interface CafeItem {
  id: number
  time: string
  name: string
  hours: string
  address: string
  rating: number
  isSaved: boolean
  image: string
}

interface HistoryGroup {
  date: string
  items: Array<CafeItem>
}

/**
 * Hàm hỗ trợ chuyển đổi dữ liệu từ file JSON trong thư mục data
 * sang cấu trúc phân nhóm cho giao diện lịch sử.
 */
const transformDataToHistory = (): Array<HistoryGroup> => {
  // Nhóm các quán cafe dựa trên dữ liệu từ cafes.json

  const todayItems = CAFE_DATA.slice(0, 5).map((item, index) => ({
    id: item.id,
    time: `${15 - index}:30`,
    name: item.name,
    hours: item.hours,
    address: item.address,
    rating: item.rating,
    isSaved: item.id % 3 === 0,
    image: item.images[0], // Lấy ảnh đầu tiên từ mảng images trong JSON
  }))

  const yesterdayItems = CAFE_DATA.slice(5, 12).map((item, index) => ({
    id: item.id,
    time: `${17 - index}:15`,
    name: item.name,
    hours: item.hours,
    address: item.address,
    rating: item.rating,
    isSaved: item.id % 4 === 0,
    image: item.images[0],
  }))

  const olderItems = CAFE_DATA.slice(12).map((item, index) => ({
    id: item.id,
    time: `${10 + (index % 5)}:00`,
    name: item.name,
    hours: item.hours,
    address: item.address,
    rating: item.rating,
    isSaved: false,
    image: item.images[0],
  }))

  return [
    { date: '今日', items: todayItems },
    { date: '昨日', items: yesterdayItems },
    { date: '2025年10月14日', items: olderItems },
  ].filter((group) => group.items.length > 0)
}

export default function HistoryPage() {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  // Khởi tạo state từ dữ liệu đã được xử lý
  const [history, setHistory] = useState<Array<HistoryGroup>>(() =>
    transformDataToHistory(),
  )

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleGroup = (groupItems: Array<CafeItem>) => {
    const groupIds = groupItems.map((item) => item.id)
    const allGroupSelected = groupIds.every((id) => selectedIds.has(id))

    const newSelected = new Set(selectedIds)
    if (allGroupSelected) {
      groupIds.forEach((id) => newSelected.delete(id))
    } else {
      groupIds.forEach((id) => newSelected.add(id))
    }
    setSelectedIds(newSelected)
  }

  const deselectAll = () => setSelectedIds(new Set())

  const deleteSelected = () => {
    const newHistory = history
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => !selectedIds.has(item.id)),
      }))
      .filter((group) => group.items.length > 0)

    setHistory(newHistory)
    setSelectedIds(new Set())
  }

  const hasSelection = selectedIds.size > 0

  return (
    <div className="min-h-screen bg-[#F9F9FB] pb-32 font-sans text-zinc-800">
      <main className="mx-auto max-w-[96%] space-y-12 p-4 md:p-8">
        <div className="py-8 text-center">
          <h1 className="relative inline-block text-3xl font-black tracking-tight text-zinc-800">
            閲覧履歴
            <div className="absolute -bottom-2 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-orange-500"></div>
          </h1>
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-orange-200">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
              <Clock className="h-10 w-10" />
            </div>
            <p className="text-xl font-bold text-orange-900/40">
              履歴はありません
            </p>
          </div>
        ) : (
          history.map((group) => {
            const groupIds = group.items.map((item) => item.id)
            const isGroupSelected = groupIds.every((id) => selectedIds.has(id))

            return (
              <section key={group.date} className="relative mb-12">
                <div className="sticky top-0 z-20 mb-4 flex items-center justify-between bg-[#F9F9FB]/95 py-4 backdrop-blur-md">
                  <h2 className="text-xl font-black tracking-tight text-zinc-800 md:text-2xl">
                    {group.date}
                  </h2>
                  <button
                    onClick={() => toggleGroup(group.items)}
                    className={`flex items-center gap-3 rounded-xl px-5 py-2.5 text-xs font-extrabold transition-all duration-300 ${
                      isGroupSelected
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'border border-orange-200 bg-white text-orange-600'
                    }`}>
                    {isGroupSelected ? '選択解除' : 'すべて選択'}
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                        isGroupSelected
                          ? 'border-white bg-white'
                          : 'border-orange-300 bg-orange-50'
                      }`}>
                      {isGroupSelected && (
                        <Check className="h-3 w-3 stroke-4 text-orange-600" />
                      )}
                    </div>
                  </button>
                </div>

                <div className="rounded-4xl border border-orange-400/40 bg-white p-3 shadow-sm md:rounded-[40px] md:p-6">
                  <div className="grid gap-4 md:gap-6">
                    {group.items.map((item) => {
                      const isSelected = selectedIds.has(item.id)
                      return (
                        <div
                          key={item.id}
                          className={`group relative flex min-h-[140px] items-stretch overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-500 ${
                            isSelected
                              ? 'border-orange-400 shadow-xl ring-4 ring-orange-500/5'
                              : 'border-[#F9F9FB] hover:border-orange-100 hover:shadow-xl'
                          }`}>
                          <div className="flex w-24 shrink-0 items-center justify-center gap-3 border-r border-gray-100 bg-gray-50/50 px-2 sm:w-32 md:px-4">
                            <div
                              onClick={() => toggleSelect(item.id)}
                              className="cursor-pointer">
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all ${
                                  isSelected
                                    ? 'border-orange-600 bg-orange-600 shadow-md'
                                    : 'border-gray-200 bg-white'
                                }`}>
                                {isSelected && (
                                  <Check className="h-4 w-4 stroke-4 text-white" />
                                )}
                              </div>
                            </div>
                            <span className="font-mono text-xs font-black text-zinc-800 md:text-base">
                              {item.time}
                            </span>
                          </div>

                          <div className="relative m-2 w-24 shrink-0 overflow-hidden rounded-[18px] sm:w-40 md:m-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col justify-center p-3 pl-2 md:p-5">
                            <div className="mb-2 flex items-start justify-between gap-2">
                              <h3 className="truncate text-sm font-black text-zinc-800 md:text-lg">
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-1 md:gap-2">
                                <div className="flex items-center rounded-lg bg-orange-600 px-1.5 py-0.5 text-white">
                                  <span className="text-[10px] font-black md:text-xs">
                                    {item.rating}
                                  </span>
                                  <Star className="ml-0.5 h-3 w-3 fill-current" />
                                </div>
                                <Bookmark
                                  className={`h-4 w-4 md:w-5 ${item.isSaved ? 'fill-current text-orange-500' : 'text-gray-200'}`}
                                />
                              </div>
                            </div>
                            <div className="mt-auto space-y-1 text-[10px] font-medium text-zinc-800 md:text-xs">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-orange-500" />
                                <span>{item.hours}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3 text-orange-500" />
                                <span className="truncate">{item.address}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>
            )
          })
        )}
      </main>

      {hasSelection && (
        <div className="fixed bottom-8 left-1/2 z-40 w-[94%] max-w-xl -translate-x-1/2">
          <div className="flex items-center justify-between rounded-4xl border border-white/10 bg-zinc-900 p-4 text-white shadow-2xl">
            <div className="flex items-center gap-4 pl-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-sm font-black text-white">
                {selectedIds.size}
              </span>
              <p className="hidden text-sm font-black sm:block">選択中</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={deselectAll}
                className="rounded-2xl bg-white/10 px-4 py-2 text-xs font-extrabold">
                キャンセル
              </button>
              <button
                onClick={deleteSelected}
                className="flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-2 text-xs font-black">
                <Trash2 className="h-4 w-4" />
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
