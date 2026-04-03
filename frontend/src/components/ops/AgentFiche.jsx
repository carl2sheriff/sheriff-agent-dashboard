import { Calendar, User, Link, Layers } from 'lucide-react'
import { cronToHuman } from '../../lib/utils'

export function AgentFiche({ agent }) {
  return (
    <div className="card p-5 space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
        <p className="text-xs text-[#6b6b6b] mt-0.5">{agent.description}</p>
      </div>

      {/* Meta rows */}
      <div className="space-y-2.5">
        <div className="flex items-start gap-2.5">
          <User size={13} className="text-[#6b6b6b] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[10px] text-[#6b6b6b] uppercase tracking-wider">Propriétaire</p>
            <p className="text-xs text-[#a1a1a1]">{agent.owner}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Calendar size={13} className="text-[#6b6b6b] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[10px] text-[#6b6b6b] uppercase tracking-wider">Schedule</p>
            <p className="text-xs text-[#a1a1a1]">{cronToHuman(agent.schedule)}</p>
            <code className="text-[10px] text-[#6b6b6b] font-mono">{agent.schedule}</code>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Link size={13} className="text-[#6b6b6b] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[10px] text-[#6b6b6b] uppercase tracking-wider">URL</p>
            <a
              href={agent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#3b82f6] hover:text-[#60a5fa] transition-colors font-mono break-all"
            >
              {agent.url}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Layers size={13} className="text-[#6b6b6b] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[10px] text-[#6b6b6b] uppercase tracking-wider">Intégrations</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {agent.integrations.map((i) => (
                <span
                  key={i}
                  className="text-[11px] bg-[#1a1a1a] border border-[#222222] text-[#a1a1a1] px-2 py-0.5 rounded"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Restart procedure */}
      <div className="border-t border-[#1a1a1a] pt-3">
        <p className="text-[10px] text-[#6b6b6b] uppercase tracking-wider mb-2">Procédure de redémarrage</p>
        <ol className="space-y-1">
          <li className="text-xs text-[#a1a1a1] flex gap-2">
            <span className="text-[#6b6b6b] flex-shrink-0">1.</span>
            Vérifier le statut sur Railway Dashboard
          </li>
          <li className="text-xs text-[#a1a1a1] flex gap-2">
            <span className="text-[#6b6b6b] flex-shrink-0">2.</span>
            Redéployer depuis le panel Sheriff Dashboard
          </li>
          <li className="text-xs text-[#a1a1a1] flex gap-2">
            <span className="text-[#6b6b6b] flex-shrink-0">3.</span>
            Vérifier les logs de démarrage ({'< '}60s)
          </li>
          <li className="text-xs text-[#a1a1a1] flex gap-2">
            <span className="text-[#6b6b6b] flex-shrink-0">4.</span>
            Confirmer via <code className="font-mono text-[10px]">GET /status</code>
          </li>
        </ol>
      </div>

      {/* Emergency contact */}
      <div className="border-t border-[#1a1a1a] pt-3">
        <p className="text-[10px] text-[#6b6b6b] uppercase tracking-wider mb-1.5">Contact d'urgence</p>
        <p className="text-xs text-[#a1a1a1]">Sheriff Projects — canal Slack <code className="font-mono text-[10px]">{agent.slackChannel}</code></p>
      </div>
    </div>
  )
}
