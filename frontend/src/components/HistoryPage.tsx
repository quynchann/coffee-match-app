import { useState } from 'react'
import { Star, Trash2, X, Clock, MapPin, Bookmark, Check } from 'lucide-react'
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
  items: CafeItem[]
}

/**
 * Hàm hỗ trợ chuyển đổi dữ liệu từ file JSON trong thư mục data
 * sang cấu trúc phân nhóm cho giao diện lịch sử.
 */
const transformDataToHistory = (): HistoryGroup[] => {
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
  const [history, setHistory] = useState<HistoryGroup[]>(() =>
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

  const toggleGroup = (groupItems: CafeItem[]) => {
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
    <div className="min-h-screen bg-[#F9F9FB] text-zinc-800 font-sans pb-32">
      <main className="max-w-[96%] mx-auto p-4 md:p-8 space-y-12">
        <div className="text-center py-8">
          <h1 className="text-3xl font-black tracking-tight text-zinc-800 inline-block relative">
            閲覧履歴
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-orange-500 rounded-full"></div>
          </h1>
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-orange-200">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-10 h-10" />
            </div>
            <p className="font-bold text-xl text-orange-900/40">
              履歴はありません
            </p>
          </div>
        ) : (
          history.map((group) => {
            const groupIds = group.items.map((item) => item.id)
            const isGroupSelected = groupIds.every((id) => selectedIds.has(id))

            return (
              <section key={group.date} className="relative mb-12">
                <div className="flex items-center justify-between sticky top-0 z-20 bg-[#F9F9FB]/95 backdrop-blur-md py-4 mb-4">
                  <h2 className="text-xl md:text-2xl font-black text-zinc-800 tracking-tight">
                    {group.date}
                  </h2>
                  <button
                    onClick={() => toggleGroup(group.items)}
                    className={`flex items-center gap-3 text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all duration-300 ${
                      isGroupSelected
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'bg-white text-orange-600 border border-orange-200'
                    }`}>
                    {isGroupSelected ? '選択解除' : 'すべて選択'}
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isGroupSelected
                          ? 'bg-white border-white'
                          : 'border-orange-300 bg-orange-50'
                      }`}>
                      {isGroupSelected && (
                        <Check className="w-3 h-3 text-orange-600 stroke-4" />
                      )}
                    </div>
                  </button>
                </div>

                <div className="bg-white rounded-4xl md:rounded-[40px] p-3 md:p-6 border border-orange-400/40 shadow-sm">
                  <div className="grid gap-4 md:gap-6">
                    {group.items.map((item) => {
                      const isSelected = selectedIds.has(item.id)
                      return (
                        <div
                          key={item.id}
                          className={`group relative bg-white rounded-3xl overflow-hidden shadow-sm border transition-all duration-500 flex items-stretch min-h-[140px] ${
                            isSelected
                              ? 'border-orange-400 ring-4 ring-orange-500/5 shadow-xl'
                              : 'border-[#F9F9FB] hover:border-orange-100 hover:shadow-xl'
                          }`}>
                          <div className="w-24 sm:w-32 shrink-0 flex items-center justify-center px-2 md:px-4 border-r border-gray-100 bg-gray-50/50 gap-3">
                            <div
                              onClick={() => toggleSelect(item.id)}
                              className="cursor-pointer">
                              <div
                                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'bg-orange-600 border-orange-600 shadow-md'
                                    : 'bg-white border-gray-200'
                                }`}>
                                {isSelected && (
                                  <Check className="w-4 h-4 text-white stroke-4" />
                                )}
                              </div>
                            </div>
                            <span className="text-xs md:text-base font-black font-mono text-zinc-800">
                              {item.time}
                            </span>
                          </div>

                          <div className="relative w-24 sm:w-40 shrink-0 overflow-hidden m-2 md:m-3 rounded-[18px]">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                          </div>

                          <div className="flex-1 p-3 md:p-5 pl-2 flex flex-col justify-center min-w-0">
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <h3 className="font-black text-sm md:text-lg text-zinc-800 truncate">
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-1 md:gap-2">
                                <div className="flex items-center bg-orange-600 text-white px-1.5 py-0.5 rounded-lg">
                                  <span className="text-[10px] md:text-xs font-black">
                                    {item.rating}
                                  </span>
                                  <Star className="w-3 h-3 fill-current ml-0.5" />
                                </div>
                                <Bookmark
                                  className={`w-4 h-4 md:w-5 ${item.isSaved ? 'text-orange-500 fill-current' : 'text-gray-200'}`}
                                />
                              </div>
                            </div>
                            <div className="space-y-1 mt-auto text-[10px] md:text-xs text-zinc-800 font-medium">
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 text-orange-500" />
                                <span>{item.hours}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-orange-500" />
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
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-xl">
          <div className="bg-zinc-900 text-white rounded-4xl p-4 flex items-center justify-between border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4 pl-3">
              <span className="flex items-center justify-center bg-orange-500 text-white w-9 h-9 rounded-xl text-sm font-black">
                {selectedIds.size}
              </span>
              <p className="hidden sm:block text-sm font-black">選択中</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={deselectAll}
                className="px-4 py-2 text-xs font-extrabold bg-white/10 rounded-2xl">
                キャンセル
              </button>
              <button
                onClick={deleteSelected}
                className="flex items-center gap-2 px-6 py-2 text-xs font-black bg-orange-500 rounded-2xl">
                <Trash2 className="w-4 h-4" />
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
