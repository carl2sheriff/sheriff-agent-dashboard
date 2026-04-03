export function MetricCard({ label, value, sub, icon: Icon, accent }) {
  const accentMap = {
    blue: 'text-[#3b82f6]',
    green: 'text-[#22c55e]',
    amber: 'text-[#f59e0b]',
    red: 'text-[#ef4444]',
    white: 'text-white',
  }

  const colorClass = accentMap[accent] || 'text-white'

  return (
    <div className="card px-4 py-3 flex items-center gap-3">
      {Icon && (
        <div className="w-8 h-8 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center flex-shrink-0">
          <Icon size={15} strokeWidth={1.5} className={colorClass} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs text-[#6b6b6b] truncate">{label}</p>
        <p className={`text-xl font-semibold leading-tight ${colorClass}`}>{value}</p>
        {sub && <p className="text-xs text-[#6b6b6b] mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  )
}
