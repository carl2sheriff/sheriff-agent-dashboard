import { useState } from 'react'
import { ExternalLink, Play, RotateCcw, Terminal, Hash, AlertTriangle } from 'lucide-react'
import { StatusBadge } from '../dashboard/StatusBadge'
import { LogViewer } from './LogViewer'
import { RunHistory } from './RunHistory'
import { useAgentStatus } from '../../hooks/useAgentStatus'
import { api } from '../../lib/api'
import { formatResponseTime, timeAgo, cronToHuman } from '../../lib/utils'

function Section({ title, children }) {
  return (
    <div className="card">
      <div className="px-4 py-3 border-b border-[#1a1a1a]">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="card w-80 p-5">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle size={18} className="text-[#f59e0b] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#a1a1a1]">{message}</p>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="btn-secondary text-xs py-1.5">
            Annuler
          </button>
          <button onClick={onConfirm} className="btn-danger text-xs py-1.5">
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}

export function AgentDetailView({ agent }) {
  const { status, responseTime, lastChecked, loading, refresh } = useAgentStatus(agent.id)
  const [running, setRunning] = useState(false)
  const [runResult, setRunResult] = useState(null)
  const [showRestartModal, setShowRestartModal] = useState(false)
  const [slackResult, setSlackResult] = useState(null)
  const [activeTab, setActiveTab] = useState('logs')

  async function handleRun() {
    if (running) return
    setRunning(true)
    setRunResult(null)
    try {
      const result = await api.runAgent(agent.id)
      setRunResult({ ok: true, message: 'Exécution déclenchée avec succès' })
      setTimeout(refresh, 2000)
    } catch (err) {
      setRunResult({ ok: false, message: err.message })
    } finally {
      setRunning(false)
      setTimeout(() => setRunResult(null), 5000)
    }
  }

  async function handleSlackCommand(command) {
    setSlackResult(null)
    try {
      const result = await api.triggerSlackCommand(agent.id, command)
      setSlackResult({ ok: true, command, message: `Commande ${command} envoyée` })
    } catch (err) {
      setSlackResult({ ok: false, command, message: err.message })
    } finally {
      setTimeout(() => setSlackResult(null), 5000)
    }
  }

  async function handleRestart() {
    setShowRestartModal(false)
    // Trigger a run as proxy for restart
    await handleRun()
  }

  return (
    <div className="space-y-4">
      {/* Status overview */}
      <Section title="Statut en temps réel">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#161616] rounded-md px-3 py-2.5 border border-[#222222]">
            <p className="text-[10px] text-[#6b6b6b] uppercase tracking-wider mb-1.5">Statut</p>
            {loading ? (
              <span className="text-xs text-[#6b6b6b]">Vérification...</span>
            ) : (
              <StatusBadge status={status} />
            )}
          </div>
          <div className="bg-[#161616] rounded-md px-3 py-2.5 border border-[#222222]">
            <p className="text-[10px] text-[#6b6b6b] uppercase tracking-wider mb-1.5">Temps de réponse</p>
            <p className="text-sm font-medium text-white">{formatResponseTime(responseTime)}</p>
          </div>
          <div className="bg-[#161616] rounded-md px-3 py-2.5 border border-[#222222]">
            <p className="text-[10px] text-[#6b6b6b] uppercase tracking-wider mb-1.5">Dernière vérif.</p>
            <p className="text-sm font-medium text-[#a1a1a1]">{lastChecked ? timeAgo(lastChecked) : '—'}</p>
          </div>
          <div className="bg-[#161616] rounded-md px-3 py-2.5 border border-[#222222]">
            <p className="text-[10px] text-[#6b6b6b] uppercase tracking-wider mb-1.5">Schedule</p>
            <p className="text-xs text-[#a1a1a1] leading-tight">{cronToHuman(agent.schedule)}</p>
          </div>
        </div>
      </Section>

      {/* Actions */}
      <Section title="Actions">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleRun}
            disabled={running}
            className="btn-primary flex items-center gap-2"
          >
            <Play size={13} />
            {running ? 'En cours...' : 'Lancer maintenant'}
          </button>

          <button
            onClick={() => setShowRestartModal(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <RotateCcw size={13} />
            Redémarrer
          </button>

          <a
            href={`https://railway.app/project/63830b39-2415-4c9e-ba52-79a6053a8dab`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center gap-2"
          >
            <ExternalLink size={13} />
            Voir sur Railway
          </a>

          {agent.slackCommands && agent.slackCommands.map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleSlackCommand(cmd)}
              className="btn-secondary flex items-center gap-2"
            >
              <Hash size={13} />
              {cmd}
            </button>
          ))}
        </div>

        {runResult && (
          <div
            className={`mt-3 text-xs px-3 py-2 rounded-md border ${
              runResult.ok
                ? 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20'
                : 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20'
            }`}
          >
            {runResult.message}
          </div>
        )}

        {slackResult && (
          <div
            className={`mt-3 text-xs px-3 py-2 rounded-md border ${
              slackResult.ok
                ? 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20'
                : 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20'
            }`}
          >
            {slackResult.message}
          </div>
        )}
      </Section>

      {/* Logs / Run History tabs */}
      <div className="card overflow-hidden">
        <div className="flex border-b border-[#222222]">
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'logs'
                ? 'text-white border-b-2 border-white -mb-px'
                : 'text-[#6b6b6b] hover:text-[#a1a1a1]'
            }`}
          >
            <Terminal size={14} />
            Logs
          </button>
          <button
            onClick={() => setActiveTab('runs')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'runs'
                ? 'text-white border-b-2 border-white -mb-px'
                : 'text-[#6b6b6b] hover:text-[#a1a1a1]'
            }`}
          >
            Historique
          </button>
        </div>
        {activeTab === 'logs' ? (
          <LogViewer agentId={agent.id} />
        ) : (
          <div className="p-1">
            <RunHistory agentId={agent.id} />
          </div>
        )}
      </div>

      {/* Config */}
      <Section title="Configuration">
        <div className="space-y-4">
          <div>
            <p className="label mb-2">Cron Expression</p>
            <code className="text-xs bg-[#161616] border border-[#222222] px-3 py-2 rounded-md block font-mono text-[#a1a1a1]">
              {agent.schedule}
              <span className="ml-3 text-[#6b6b6b]">— {cronToHuman(agent.schedule)}</span>
            </code>
          </div>

          <div>
            <p className="label mb-2">URL de service</p>
            <a
              href={agent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#3b82f6] hover:text-[#60a5fa] transition-colors font-mono"
            >
              {agent.url}
            </a>
          </div>

          <div>
            <p className="label mb-2">Variables d'environnement</p>
            <div className="space-y-1">
              {agent.environmentVars.map((v) => (
                <div
                  key={v.name}
                  className="flex items-center justify-between bg-[#161616] border border-[#222222] rounded-md px-3 py-1.5"
                >
                  <span className="text-xs font-mono text-[#a1a1a1]">{v.name}</span>
                  <span className="text-xs font-mono text-[#6b6b6b]">***</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="label mb-2">Intégrations</p>
            <div className="flex flex-wrap gap-2">
              {agent.integrations.map((i) => (
                <span
                  key={i}
                  className="text-xs bg-[#161616] border border-[#222222] text-[#a1a1a1] px-2.5 py-1 rounded-md"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>

          {agent.slackCommands && agent.slackCommands.length > 0 && (
            <div>
              <p className="label mb-2">Commandes Slack</p>
              <div className="flex flex-wrap gap-2">
                {agent.slackCommands.map((cmd) => (
                  <code
                    key={cmd}
                    className="text-xs bg-[#161616] border border-[#222222] text-[#3b82f6] px-2.5 py-1 rounded-md font-mono"
                  >
                    {cmd}
                  </code>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      {showRestartModal && (
        <ConfirmModal
          message={`Confirmer le redémarrage de "${agent.name}" ? Cette action déclenchera une nouvelle exécution de l'agent.`}
          onConfirm={handleRestart}
          onCancel={() => setShowRestartModal(false)}
        />
      )}
    </div>
  )
}
