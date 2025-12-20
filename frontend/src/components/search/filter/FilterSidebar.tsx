import FilterDropdown from './FilterDropdown'

interface Filters {
  area: string | null
  purpose: string | null
  priceMin: number | null
  priceMax: number | null
  amenities: Array<string>
}

interface FilterSidebarProps {
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  priceInputs: { min: string; max: string }
  setPriceInputs: React.Dispatch<
    React.SetStateAction<{ min: string; max: string }>
  >
  onApplyPrice: () => void
  priceApplied: boolean
  setPriceApplied: React.Dispatch<React.SetStateAction<boolean>>
}

const AREAS = [
  { id: 'hbt', label: 'Hai Ba Trung', jpLabel: 'ハイバーチュン区' },
  { id: 'hk', label: 'Hoan Kiem', jpLabel: 'ホアンキエム区' },
  { id: 'cg', label: 'Cau Giay', jpLabel: 'カウザイ区' },
  { id: 'bd', label: 'Ba Dinh', jpLabel: 'バーディン区' },
]

const PURPOSES = [
  { id: 'study', label: 'Hoc tap', jpLabel: '勉強' },
  { id: 'work', label: 'Cong viec', jpLabel: '仕事' },
  { id: 'date', label: 'Hen ho', jpLabel: 'デート' },
  { id: 'relax', label: 'Thu gian', jpLabel: 'リラックス' },
]

const AMENITY_FILTERS = [
  { id: 'wifi', label: 'Wi-Fiあり' },
  { id: 'kids', label: '子どもOK' },
  { id: 'quiet', label: '静か' },
  { id: 'ac', label: 'エアコンあり' },
  { id: 'nosmoke', label: '禁煙席あり' },
]

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  priceInputs,
  setPriceInputs,
  onApplyPrice,
  priceApplied,
  setPriceApplied,
}) => {
  return (
    <aside className="h-fit w-full shrink-0 space-y-6 md:sticky md:top-24 md:w-64">
      <FilterDropdown
        title="場所"
        placeholder="場所"
        options={AREAS}
        selectedId={filters.area}
        onSelect={(id) => setFilters((prev) => ({ ...prev, area: id }))}
      />

      <FilterDropdown
        title="目的"
        placeholder="目的"
        options={PURPOSES}
        selectedId={filters.purpose}
        onSelect={(id) => setFilters((prev) => ({ ...prev, purpose: id }))}
      />

      <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
        <div className="mb-4 rounded bg-[#555] py-1.5 text-center text-sm font-bold text-white">
          価格帯
        </div>

        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute top-2 right-2 text-xs text-gray-500">
              VND
            </span>
            <input
              type="text"
              placeholder="から"
              className="w-full rounded border border-gray-300 px-2 py-1.5 pr-10 text-sm focus:border-[#F26546] focus:outline-none"
              value={priceInputs.min}
              onChange={(e) => {
                setPriceInputs((prev) => ({ ...prev, min: e.target.value }))
                setPriceApplied(false)
              }}
            />
          </div>
          <span className="text-gray-500">~</span>
          <div className="relative flex-1">
            <span className="absolute top-2 right-2 text-xs text-gray-500">
              VND
            </span>
            <input
              type="text"
              placeholder="まで"
              className="w-full rounded border border-gray-300 px-2 py-1.5 pr-10 text-sm focus:border-[#F26546] focus:outline-none"
              value={priceInputs.max}
              onChange={(e) => {
                setPriceInputs((prev) => ({ ...prev, max: e.target.value }))
                setPriceApplied(false)
              }}
            />
          </div>
        </div>

        <button
          onClick={onApplyPrice}
          className={`mb-6 w-full rounded py-2 font-bold text-white shadow-sm transition ${
            priceApplied
              ? 'bg-[#e85f2f] shadow-md ring-2 ring-[#f26546]/40'
              : 'bg-[#FF7F50] hover:opacity-90'
          }`}>
          適用
        </button>

        <div className="space-y-2">
          {AMENITY_FILTERS.map((amenity) => {
            const isActive = filters.amenities.includes(amenity.id)
            return (
              <button
                key={amenity.id}
                onClick={() => {
                  setFilters((prev) => {
                    const exists = prev.amenities.includes(amenity.id)
                    return {
                      ...prev,
                      amenities: exists
                        ? prev.amenities.filter((a) => a !== amenity.id)
                        : [...prev.amenities, amenity.id],
                    }
                  })
                }}
                className={`flex w-full items-center justify-center gap-2 rounded border px-4 py-2.5 text-sm font-bold transition ${
                  isActive
                    ? 'border-[#F26546] bg-[#F26546] text-white shadow-sm'
                    : 'border-[#444444] bg-[#444444] text-white hover:bg-[#555]'
                }`}>
                {amenity.label}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

export default FilterSidebar
