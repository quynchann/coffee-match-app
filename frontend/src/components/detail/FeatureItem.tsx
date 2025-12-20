import { Car, Check, Coffee, Dog, Volume2, Wifi } from 'lucide-react'

const FeatureItem: React.FC<{ text: string }> = ({ text }) => {
  let Icon = Check
  if (text.includes('Wi-Fi')) Icon = Wifi
  if (text.includes('駐車場') || text.includes('đỗ xe')) Icon = Car
  if (text.includes('軽食') || text.includes('ăn')) Icon = Coffee
  if (text.includes('ペット') || text.includes('thú cưng')) Icon = Dog
  if (text.includes('静か') || text.includes('yên tĩnh')) Icon = Volume2

  return (
    <li className="flex items-center gap-3 rounded-lg border border-orange-100/50 bg-orange-50/50 p-3 transition-colors hover:bg-orange-50">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-orange-100 bg-white text-[#F26546] shadow-sm">
        <Icon size={16} />
      </div>
      <span className="text-sm font-medium text-gray-700">{text}</span>
    </li>
  )
}

export default FeatureItem
