import { CheckCircle, XCircle, AlertTriangle, Info, Check } from 'lucide-react'
import { formatDate, timeAgo } from '../../lib/utils'

const SEVERITY_CONFIG = {
  error: {
    icon: XCircle,
    color: 'text-[#ef4444]',
    bg: 'bg-[#ef4444]/5',
    border: 'border-[#ef4444]/20',
    label: 'Erreur',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-[#f59e0b]',
    bg: 'bg-[#f59e0b]/5',
    border: 'border-[#f59e0b]/20',
    label: 'Avertissement',
  },
  info: {
    icon: Info,
    color: 'text-[#3b82f6]',
    bg: 'bg-[#3b82f6]/5',
    border: 'border-[#3b82f6]/20',
    label: 'Info',
  },
}

const TYPE_LABELS = {
  status_check: 'Vérification statut',
  response_time: 'Délai de réponse',
  run_failure: "Échec d'exécution",
  schedule_missed: 'Schedule manqué',
  integration_error: "Erreur d'intégration",
}

export function AlertItem({ alert, onResolve }) {
  const config = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info
  const Icon = config.icon

  return (
    <div
      className={`flex gap-3 p-4 rounded-lg border transition-colors ${
        alert.resolved
          ? 'bg-[#0d0d0d] border-[#1a1a1a] opacity-60'
          : `${config.bg} ${config.border}`
      }`}
    >
      <Icon size={15} className={`flex-shrink-0 mt-0.5 ${alert.resolved ? 'text-[#6b6b6b]' : config.color}`} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-[#a1a1a1]">{alert.agentName}</span>
              <span className="text-[10px] text-[#6b6b6b] bg-[#1a1a1a] border border-[#222222] px-1.5 py-0.5 rounded">
                {TYPE_LABELS[alert.type] || alert.type}
              </span>
              {!alert.resolved && (
                <span className={`text-[10px] font-medium ${config.color}`}>
                  {config.label}
                </span>
              )}
            </div>
            <p className="text-xs text-[#a1a1a1] mt-1">{alert.message}</p>
          </div>

          {!alert.resolved && onResolve && (
            <button
              onClick={() => onResolve(alert.id)}
              className="flex-shrink-0 flex items-center gap-1 text-[11px] text-[#6b6b6b] hover:text-[#22c55e] transition-colors border border-[#222222] hover:border-[#22c55e]/30 px-2 py-1 rounded"
            >
              <Check size={10} />
              Résoudre
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 mt-2">
          <span className="text-[10px] text-[#6b6b6b]">{timeAgo(alert.timestamp)}</span>
          {alert.resolved && alert.resolvedAt && (
            <span className="text-[10px] text-[#6b6b6b]">
              Résolu {timeAgo(alert.resolvedAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
