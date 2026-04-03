import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, Clock, Zap, ExternalLink } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { useAgentStatus } from '../../hooks/useAgentStatus'
import { api } from '../../lib/api'
import { timeAgo, formatResponseTime, getNextRunFromCron, cronToHuman, formatDate } from '../../lib/utils'

const INTEGRATION_COLORS = {
  Slack: 'bg-[#4A154B]/20 text-[#a855f7] border-[#4A154B]/40',
  'Google Sheets': 'bg-[#0F9D58]/10 text-[#22c55e] border-[#0F9D58]/30',
  'Google Drive': 'bg-[#4285F4]/10 text-[#60a5fa] border-[#4285F4]/30',
  Railway: 'bg-[#8B5CF6]/10 text-[#a78bfa] border-[#8B5CF6]/30',
  OpenAI: 'bg-[#10a37f]/10 text-[#34d399] border-[#10a37f]/30',
}

export function AgentCard({ agent }) {
  const { status, responseTime, lastChecked, loading } = useAgentStatus(agent.id)
  const [running, setRunning] = useState(false)
  const [runResult, setRunResult] = useState(null)

  const nextRun = getNextRunFromCron(agent.schedule)

  async function handleRun() {
    if (running) return
    setRunning(true)
    setRunResult(null)
    try {
      const result = await api.runAgent(agent.id)
      setRunResult({ ok: true, message: 'Exécution déclenchée' })
    } catch (err) {
      setRunResult({ ok: false, message: err.message })
    } finally {
      setRunning(false)
      setTimeout(() => setRunResult(null), 4000)
    }
  }

  return (
    <div className="card p-5 flex flex-col gap-4 hover:border-[#2a2a2a] transition-colors duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">{agent.name}</h3>
          <p className="text-xs text-[#6b6b6b] mt-0.5 line-clamp-2">{agent.description}</p>
        </div>
        <div className="flex-shrink-0">
          {loading ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-[#6b6b6b] px-2 py-1 bg-[#1a1a1a] rounded-full border border-[#222222]">
              <span className="w-2 h-2 rounded-full bg-[#333] animate-pulse" />
              Vérification...
            </span>
          ) : (
            <StatusBadge status={status} />
          )}
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#161616] rounded-md px-3 py-2 border border-[#222222]">
          <p className="text-[10px] text-[#6b6b6b] uppercase tracking-wider mb-1">Dernière vérif.</p>
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-[#6b6b6b]" />
            <span className="text-xs text-[#a1a1a1]">{lastChecked ? timeAgo(lastChecked) : '—'}</span>
          </div>
        </div>
        <div className="bg-[#161616] rounded-md px-3 py-2 border border-[#222222]">
          <p className="text-[10px] text-[#6b6b6b] uppercase tracking-wider mb-1">Temps de réponse</p>
          <div className="flex items-center gap-1.5">
            <Zap size={12} className="text-[#6b6b6b]" />
            <span className="text-xs text-[#a1a1a1]">{formatResponseTime(responseTime)}</span>
          </div>
        </div>
        <div className="bg-[#161616] rounded-md px-3 py-2 border border-[#222222] col-span-2">
          <p className="text-[10px] text-[#6b6b6b] uppercase tracking-wider mb-1">Prochain passage</p>
          <p className="text-xs text-[#a1a1a1]">
            {nextRun ? formatDate(nextRun) : cronToHuman(agent.schedule)}
          </p>
        </div>
      </div>

      {/* Integrations */}
      <div className="flex flex-wrap gap-1.5">
        {agent.integrations.map((integration) => (
          <span
            key={integration}
            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
              INTEGRATION_COLORS[integration] || 'bg-[#1a1a1a] text-[#a1a1a1] border-[#2a2a2a]'
            }`}
          >
            {integration}
          </span>
        ))}
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border bg-[#1a1a1a] text-[#6b6b6b] border-[#222222]">
          {agent.slackChannel}
        </span>
      </div>

      {/* Run result feedback */}
      {runResult && (
        <div
          className={`text-xs px-3 py-2 rounded-md border ${
            runResult.ok
              ? 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20'
              : 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20'
          }`}
        >
          {runResult.message}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-[#1a1a1a]">
        <button
          onClick={handleRun}
          disabled={running}
          className="btn-primary flex items-center gap-1.5 text-xs py-1.5 px-3"
        >
          <Play size={12} />
          {running ? 'En cours...' : 'Lancer'}
        </button>
        <Link
          to={`/agents/${agent.id}`}
          className="btn-secondary flex items-center gap-1.5 text-xs py-1.5 px-3"
        >
          Détails
          <ArrowRight size={12} />
        </Link>
        <a
          href={`https://railway.app/project/63830b39-2415-4c9e-ba52-79a6053a8dab`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-[#6b6b6b] hover:text-[#a1a1a1] transition-colors"
          title="Voir sur Railway"
        >
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  )
}
