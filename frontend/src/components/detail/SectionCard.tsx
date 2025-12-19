const SectionCard: React.FC<{
  title: string
  children: React.ReactNode
  icon?: React.ReactNode
}> = ({ title, children, icon }) => {
  return (
    <div className="relative mt-8 group w-full">
      <div className="absolute -top-4 left-6 bg-white px-3 py-1 flex items-center gap-2 z-10 border border-[#F26546]/20 rounded-full shadow-sm">
        {icon && <span className="text-[#F26546]">{icon}</span>}
        <h2 className="font-bold text-[#F26546] text-sm md:text-base tracking-wide">
          {title}
        </h2>
      </div>
      <div className="bg-white rounded-xl border border-[#F26546]/30 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 w-full">
        {children}
      </div>
    </div>
  )
}

export default SectionCard