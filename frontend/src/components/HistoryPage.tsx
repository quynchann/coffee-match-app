import { useState } from 'react'
import { Star, Trash2, X, Clock, MapPin, Bookmark, Check } from 'lucide-react'

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

// --- Dữ liệu mẫu với 30 quán cafe tại Hà Nội ---
const INITIAL_HISTORY: HistoryGroup[] = [
  {
    date: '今日',
    items: [
      {
        id: 1,
        time: '14:30',
        name: 'Highlands Coffee',
        hours: '07:00 - 23:00',
        address: '129 Le Duan, Hoan Kiem',
        rating: 4.2,
        isSaved: true,
        image:
          'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300',
      },
      {
        id: 2,
        time: '11:15',
        name: 'Trung Nguyen Legend',
        hours: '06:30 - 22:00',
        address: '52 Hai Ba Trung, Hoan Kiem',
        rating: 4.5,
        isSaved: false,
        image:
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300',
      },
      {
        id: 3,
        time: '09:45',
        name: 'The Coffee House',
        hours: '07:00 - 22:30',
        address: '23 Hai Ba Trung, Hoan Kiem',
        rating: 4.0,
        isSaved: false,
        image:
          'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=300',
      },
      {
        id: 4,
        time: '08:20',
        name: 'Phuc Long Coffee & Tea',
        hours: '07:00 - 22:00',
        address: '82 Hang Dieu, Hoan Kiem',
        rating: 4.3,
        isSaved: true,
        image:
          'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300',
      },
      {
        id: 5,
        time: '07:05',
        name: 'Cong Ca Phe',
        hours: '07:30 - 23:30',
        address: '27 Nha Tho, Hoan Kiem',
        rating: 4.6,
        isSaved: false,
        image:
          'https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=300',
      },
    ],
  },
  {
    date: '昨日',
    items: [
      {
        id: 6,
        time: '16:45',
        name: 'Starbucks Vietnam',
        hours: '07:00 - 23:00',
        address: '32 Hang Bai, Hoan Kiem',
        rating: 4.1,
        isSaved: true,
        image:
          'https://images.unsplash.com/photo-1559925393-8be0ec4167c3?w=300',
      },
      {
        id: 7,
        time: '13:20',
        name: 'Katinat Saigon Kafe',
        hours: '07:00 - 02:00',
        address: '18 Phan Dinh Phung, Ba Dinh',
        rating: 4.7,
        isSaved: false,
        image:
          'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300',
      },
      {
        id: 8,
        time: '10:30',
        name: 'King Coffee',
        hours: '07:00 - 22:00',
        address: '168 Kim Ma, Ba Dinh',
        rating: 3.8,
        isSaved: false,
        image:
          'https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=300',
      },
      {
        id: 9,
        time: '09:15',
        name: 'Cheese Coffee',
        hours: '08:00 - 22:30',
        address: '50A Le Dai Hanh, Hai Ba Trung',
        rating: 4.4,
        isSaved: true,
        image:
          'https://images.unsplash.com/photo-1521017432531-fbd92d744264?w=300',
      },
      {
        id: 10,
        time: '07:40',
        name: 'Urban Station',
        hours: '07:00 - 23:00',
        address: '34 Hang Ca, Hoan Kiem',
        rating: 4.0,
        isSaved: false,
        image:
          'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=300',
      },
    ],
  },
  {
    date: '2025年10月14日',
    items: [
      {
        id: 11,
        time: '19:20',
        name: 'Gemini Coffee',
        hours: '07:00 - 23:00',
        address: '7 Nguyen Huu Huan, Hoan Kiem',
        rating: 4.2,
        isSaved: false,
        image:
          'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300',
      },
      {
        id: 12,
        time: '17:05',
        name: 'Effoc Coffee',
        hours: '07:30 - 22:00',
        address: '2 Tran Hung Dao, Hoan Kiem',
        rating: 3.9,
        isSaved: false,
        image:
          'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=300',
      },
      {
        id: 13,
        time: '15:45',
        name: 'Nhien Cafe',
        hours: '08:00 - 21:00',
        address: '20 Ngo 82 Duy Tan, Cau Giay',
        rating: 4.8,
        isSaved: true,
        image:
          'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=300',
      },
      {
        id: 14,
        time: '13:30',
        name: 'Lang Coffee',
        hours: '09:00 - 22:00',
        address: '56 Nguyen Huy Tuong, Thanh Xuan',
        rating: 4.5,
        isSaved: false,
        image:
          'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300',
      },
      {
        id: 15,
        time: '11:10',
        name: 'Tron Cafe',
        hours: '08:30 - 22:30',
        address: '11 Ngo 279 Doi Can, Ba Dinh',
        rating: 4.7,
        isSaved: false,
        image:
          'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=300',
      },
      {
        id: 16,
        time: '10:20',
        name: 'Goc Nho Cafe',
        hours: '07:00 - 21:00',
        address: '18 Ngo 135 Doi Can, Ba Dinh',
        rating: 4.0,
        isSaved: true,
        image:
          'https://images.unsplash.com/photo-1469957761103-559364b28cbe?w=300',
      },
      {
        id: 17,
        time: '09:40',
        name: 'Nha Cu Cafe',
        hours: '07:30 - 22:00',
        address: '11 Tran Quoc Toan, Hoan Kiem',
        rating: 4.3,
        isSaved: false,
        image:
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300',
      },
      {
        id: 18,
        time: '08:15',
        name: 'Tiem Ca Phe Thang Sau',
        hours: '08:00 - 22:00',
        address: '85 Yen Phu, Tay Ho',
        rating: 4.6,
        isSaved: false,
        image:
          'https://images.unsplash.com/photo-1525193612562-0ec53b0e5d7c?w=300',
      },
      {
        id: 19,
        time: '07:30',
        name: 'Ca Phe Bui Pho',
        hours: '06:00 - 23:00',
        address: '25 Ta Hien, Hoan Kiem',
        rating: 3.7,
        isSaved: false,
        image:
          'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=300',
      },
      {
        id: 20,
        time: '06:50',
        name: 'Ca Phe Nep Cu',
        hours: '06:30 - 21:00',
        address: '63 Cua Bac, Ba Dinh',
        rating: 4.2,
        isSaved: true,
        image:
          'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=300',
      },
    ],
  },
]

export default function App() {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [history, setHistory] = useState<HistoryGroup[]>(INITIAL_HISTORY)

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
      {/* Nội dung chính - Đã chỉnh max-width lên 96% để gần full màn hình */}
      <main className="max-w-[96%] mx-auto p-4 md:p-8 space-y-12">
        {/* Khu vực tiêu đề căn giữa */}
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
              <section key={group.date} className="relative">
                {/* Header nhóm */}
                <div className="flex items-center justify-between sticky top-0 z-20 bg-[#F9F9FB]/95 backdrop-blur-md py-4 mb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl md:text-2xl font-black text-zinc-800 tracking-tight">
                      {group.date}
                    </h2>
                  </div>

                  <button
                    onClick={() => toggleGroup(group.items)}
                    className={`flex items-center gap-3 text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all duration-300 ${
                      isGroupSelected
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-200'
                        : 'bg-white text-orange-600 border border-orange-200'
                    }`}>
                    {isGroupSelected ? '選択解除' : 'すべて選択'}
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
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

                {/* Container nhóm với viền cam */}
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
                              : 'border-[#F9F9FB] hover:border-orange-100 hover:shadow-xl hover:-translate-y-1'
                          }`}>
                          {/* CỘT TRÁI: Checkbox và Thời gian */}
                          <div className="w-24 sm:w-32 shrink-0 flex items-center justify-center px-2 md:px-4 border-r border-gray-100 bg-gray-50/50 gap-3 md:gap-6">
                            <div
                              onClick={() => toggleSelect(item.id)}
                              className="cursor-pointer">
                              <div
                                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                                  isSelected
                                    ? 'bg-orange-600 border-orange-600 shadow-md scale-110'
                                    : 'bg-white border-gray-200 hover:border-orange-400'
                                }`}>
                                {isSelected && (
                                  <Check className="w-4 h-4 text-white stroke-4" />
                                )}
                              </div>
                            </div>

                            <span className="text-xs md:text-base font-black font-mono text-zinc-800 tracking-tighter">
                              {item.time}
                            </span>
                          </div>

                          {/* Hình ảnh */}
                          <div className="relative w-24 sm:w-40 shrink-0 overflow-hidden m-2 md:m-3 rounded-[18px]">
                            <img
                              src={item.image}
                              alt={item.name}
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300'
                              }}
                            />
                          </div>

                          {/* Nội dung */}
                          <div className="flex-1 p-3 md:p-5 pl-2 flex flex-col justify-center min-w-0">
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <h3 className="font-black text-sm md:text-lg text-zinc-800 truncate tracking-tight">
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-1 md:gap-2 shrink-0">
                                <div className="flex items-center bg-orange-600 text-white px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg shadow-sm">
                                  <span className="text-[10px] md:text-xs font-black leading-none">
                                    {item.rating}
                                  </span>
                                  <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-current ml-0.5 md:ml-1" />
                                </div>
                                <button
                                  className={`p-1.5 md:p-2 hover:bg-gray-50 rounded-xl transition-all ${item.isSaved ? 'text-orange-500' : 'text-gray-200'}`}>
                                  <Bookmark
                                    className={`w-4 h-4 md:w-5 md:h-5 ${item.isSaved ? 'fill-current' : ''}`}
                                  />
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1 mt-auto">
                              <div className="flex items-center gap-2 text-[10px] md:text-xs text-zinc-800 font-medium">
                                <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-orange-500" />
                                <span>{item.hours}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] md:text-xs text-zinc-800 font-medium">
                                <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-orange-500 shrink-0" />
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

      {/* Thanh Action nổi */}
      {hasSelection && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-xl animate-in fade-in zoom-in slide-in-from-bottom-10 duration-500 ease-out">
          <div className="bg-zinc-900 text-white rounded-4xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)] p-4 flex items-center justify-between border border-white/10">
            <div className="flex items-center gap-4 pl-3">
              <span className="flex items-center justify-center bg-orange-500 text-white w-9 h-9 rounded-xl text-sm font-black shadow-lg shadow-orange-500/20">
                {selectedIds.size}
              </span>
              <div className="hidden sm:block">
                <p className="text-sm font-black tracking-tight">選択中</p>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest"></p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={deselectAll}
                className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-extrabold bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                <X className="w-4 h-4" />
                <span className="hidden xs:inline">キャンセル</span>
              </button>

              <button
                onClick={deleteSelected}
                className="flex items-center gap-2 px-6 md:px-7 py-2 md:py-2.5 text-xs md:text-sm font-black bg-orange-500 hover:bg-orange-400 rounded-2xl transition-all shadow-lg active:scale-95">
                <Trash2 className="w-4 h-4" />
                削除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Style thanh cuộn */}
      <style>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 20px;
          border: 2px solid #F9F9FB;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
      `}</style>
    </div>
  )
}
