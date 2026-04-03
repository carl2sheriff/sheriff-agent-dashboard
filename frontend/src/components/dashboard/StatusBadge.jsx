const STATUS_CONFIG = {
  healthy: {
    label: 'Actif',
    dot: 'bg-[#22c55e]',
    text: 'text-[#22c55e]',
    bg: 'bg-[#22c55e]/10',
    border: 'border-[#22c55e]/20',
    pulse: true,
  },
  degraded: {
    label: 'Dégradé',
    dot: 'bg-[#f59e0b]',
    text: 'text-[#f59e0b]',
    bg: 'bg-[#f59e0b]/10',
    border: 'border-[#f59e0b]/20',
    pulse: false,
  },
  down: {
    label: 'Hors ligne',
    dot: 'bg-[#ef4444]',
    text: 'text-[#ef4444]',
    bg: 'bg-[#ef4444]/10',
    border: 'border-[#ef4444]/20',
    pulse: false,
  },
  unknown: {
    label: 'Inconnu',
    dot: 'bg-[#6b6b6b]',
    text: 'text-[#6b6b6b]',
    bg: 'bg-[#6b6b6b]/10',
    border: 'border-[#6b6b6b]/20',
    pulse: false,
  },
}

export function StatusBadge({ status = 'unknown', size = 'sm' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.unknown

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1',
  }

  const dotSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      <span
        className={`rounded-full flex-shrink-0 ${config.dot} ${dotSizeClasses[size]} ${
          config.pulse ? 'animate-pulse' : ''
        }`}
      />
      {config.label}
    </span>
  )
}
