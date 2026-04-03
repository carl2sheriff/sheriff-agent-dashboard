import { Shield, RefreshCw, Menu } from 'lucide-react'
import { formatDate } from '../../lib/utils'

export function Header({ title, subtitle, lastUpdated, onRefresh, refreshing = false, onMenuToggle }) {
  return (
    <header className="h-14 border-b border-[#222222] bg-[#0a0a0a] flex items-center px-4 md:px-6 gap-4 flex-shrink-0">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="md:hidden text-[#6b6b6b] hover:text-white transition-colors"
      >
        <Menu size={18} />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-white truncate">{title}</h1>
        {subtitle && <p className="text-xs text-[#6b6b6b] truncate">{subtitle}</p>}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {lastUpdated && (
          <span className="hidden sm:block text-xs text-[#6b6b6b]">
            Mis à jour {formatDate(lastUpdated)}
          </span>
        )}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs text-[#6b6b6b] hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
        )}
      </div>
    </header>
  )
}
