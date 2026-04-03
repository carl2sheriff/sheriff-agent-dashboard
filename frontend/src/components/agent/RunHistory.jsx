import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react'
import { api } from '../../lib/api'
import { formatDate, formatDuration } from '../../lib/utils'

const STATUS_ICONS = {
  success: <CheckCircle size={13} className="text-[#22c55e]" />,
  failed: <XCircle size={13} className="text-[#ef4444]" />,
  warning: <AlertTriangle size={13} className="text-[#f59e0b]" />,
}

const STATUS_LABELS = {
  success: 'Succès',
  failed: 'Échec',
  warning: 'Avertissement',
}

const STATUS_TEXT = {
  success: 'text-[#22c55e]',
  failed: 'text-[#ef4444]',
  warning: 'text-[#f59e0b]',
}

export function RunHistory({ agentId }) {
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRuns()
  }, [agentId])

  async function fetchRuns() {
    setLoading(true)
    try {
      const data = await api.getAgentRuns(agentId)
      setRuns(data.runs || [])
    } catch {
      setRuns([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-xs text-[#6b6b6b]">
        Chargement de l'historique...
      </div>
    )
  }

  if (runs.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-xs text-[#6b6b6b]">
        Aucun historique d'exécution
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-[#222222]">
            <th className="text-left py-2 px-3 text-[#6b6b6b] font-medium">Horodatage</th>
            <th className="text-left py-2 px-3 text-[#6b6b6b] font-medium">Statut</th>
            <th className="text-left py-2 px-3 text-[#6b6b6b] font-medium">Durée</th>
            <th className="text-left py-2 px-3 text-[#6b6b6b] font-medium">Déclencheur</th>
            <th className="text-left py-2 px-3 text-[#6b6b6b] font-medium">Note</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1a1a1a]">
          {runs.map((run) => (
            <tr key={run.id} className="hover:bg-[#161616] transition-colors">
              <td className="py-2.5 px-3 text-[#a1a1a1] font-mono whitespace-nowrap">
                {formatDate(run.timestamp)}
              </td>
              <td className="py-2.5 px-3">
                <div className="flex items-center gap-1.5">
                  {STATUS_ICONS[run.status]}
                  <span className={STATUS_TEXT[run.status]}>{STATUS_LABELS[run.status]}</span>
                </div>
              </td>
              <td className="py-2.5 px-3 text-[#a1a1a1] font-mono">{formatDuration(run.duration)}</td>
              <td className="py-2.5 px-3">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    run.triggeredBy === 'manual'
                      ? 'bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20'
                      : 'bg-[#1a1a1a] text-[#6b6b6b] border border-[#222222]'
                  }`}
                >
                  {run.triggeredBy === 'manual' ? 'Manuel' : 'Planifié'}
                </span>
              </td>
              <td className="py-2.5 px-3 text-[#6b6b6b] max-w-48 truncate">{run.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
