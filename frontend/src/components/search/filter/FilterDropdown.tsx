import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface DropdownOption {
  id: string
  label: string // Tên hiển thị (Tiếng Nhật)
}

interface FilterDropdownProps {
  title: string
  options: Array<DropdownOption>
  selectedId: string | null
  onSelect: (id: string | null) => void
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  title,
  options,
  selectedId,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Tìm option đang chọn để hiển thị label tiếng Nhật trên button
  const selectedOption = options.find((opt) => opt.id === selectedId)

  return (
    <div className="group relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full cursor-pointer items-center justify-between rounded px-4 py-3 shadow-md transition ${isOpen ? 'bg-[#333] text-white' : 'bg-black text-white hover:bg-[#222]'} `}>
        <span className="truncate pr-2 font-bold">
          {selectedOption ? selectedOption.label : title}
        </span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-20 mt-2 max-h-64 w-full overflow-hidden overflow-y-auto rounded-md border border-gray-200 bg-white shadow-xl">
          <button
            type="button"
            onClick={() => {
              onSelect(null)
              setIsOpen(false)
            }}
            className="w-full cursor-pointer border-b border-gray-100 px-4 py-3 text-left text-sm font-medium text-gray-500 hover:bg-gray-100">
            -- すべて / リセット --
          </button>

          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onSelect(opt.id)
                setIsOpen(false)
              }}
              className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-gray-100 ${selectedId === opt.id ? 'bg-orange-50 font-bold text-[#F26546]' : 'text-gray-700'} `}>
              <span className="font-bold">{opt.label}</span>
              {selectedId === opt.id && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default FilterDropdown
