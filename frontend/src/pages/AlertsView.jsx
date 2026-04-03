import { useState } from 'react'
import { Bell, Filter, Shield } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { AlertItem } from '../components/alerts/AlertItem'
import { useAlerts } from '../hooks/useAlerts'

const SEVERITY_OPTIONS = [
  { value: 'all', label: 'Toutes' },
  { value: 'error', label: 'Erreurs' },
  { value: 'warning', label: 'Avertissements' },
  { value: 'info', label: 'Info' },
]

const AGENT_OPTIONS = [
  { value: 'all', label: 'Tous les agents' },
  { value: 'repartition-ca-marge', label: 'Répartition CA/Marge' },
  { value: 'scouting-talent', label: 'Scouting Talent' },
]

function RuleCard({ rule }) {
  const severityColors = {
    error: 'text-[#ef4444]',
    warning: 'text-[#f59e0b]',
    info: 'text-[#3b82f6]',
  }

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium ${severityColors[rule.severity]}`}>
              {rule.severity === 'error' ? 'Erreur' : rule.severity === 'warning' ? 'Avertissement' : 'Info'}
            </span>
            <span className="text-[10px] text-[#6b6b6b]">
              {rule.agents.includes('all') ? 'Tous agents' : rule.agents.join(', ')}
            </span>
          </div>
          <p className="text-xs font-medium text-white mb-1">{rule.name}</p>
          <p className="text-xs text-[#6b6b6b]">{rule.description}</p>
          <code className="text-[10px] text-[#6b6b6b] font-mono mt-1 block">{rule.condition}</code>
        </div>
        <div className="flex-shrink-0">
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
              rule.enabled
                ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20'
                : 'bg-[#1a1a1a] text-[#6b6b6b] border border-[#222222]'
            }`}
          >
            {rule.enabled ? 'Actif' : 'Désactivé'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function AlertsView({ toggleMenu }) {
  const [severityFilter, setSeverityFilter] = useState('all')
  const [agentFilter, setAgentFilter] = useState('all')
  const [showResolved, setShowResolved] = useState(true)
  const [activeTab, setActiveTab] = useState('alerts')

  const { alerts, rules, unresolvedCount, totalCount, resolveAlert } = useAlerts({
    agentFilter,
    severityFilter,
  })

  const visibleAlerts = showResolved ? alerts : alerts.filter((a) => !a.resolved)

  return (
    <>
      <Header
        title="Alertes"
        subtitle={`${unresolvedCount} non résolue${unresolvedCount !== 1 ? 's' : ''} · ${totalCount} au total`}
        onMenuToggle={toggleMenu}
      />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-[#222222]">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'alerts'
                ? 'text-white border-b-2 border-white -mb-px'
                : 'text-[#6b6b6b] hover:text-[#a1a1a1]'
            }`}
          >
            <Bell size={14} />
            Historique
            {unresolvedCount > 0 && (
              <span className="ml-1 text-[10px] bg-[#ef4444] text-white px-1.5 py-0.5 rounded-full font-semibold">
                {unresolvedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'rules'
                ? 'text-white border-b-2 border-white -mb-px'
                : 'text-[#6b6b6b] hover:text-[#a1a1a1]'
            }`}
          >
            <Shield size={14} />
            Règles
          </button>
        </div>

        {activeTab === 'alerts' ? (
          <>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter size={13} className="text-[#6b6b6b]" />
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="input py-1.5 text-xs"
              >
                {AGENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="input py-1.5 text-xs"
              >
                {SEVERITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-xs text-[#a1a1a1] cursor-pointer ml-1">
                <input
                  type="checkbox"
                  checked={showResolved}
                  onChange={(e) => setShowResolved(e.target.checked)}
                  className="rounded border-[#2a2a2a] bg-[#111111] accent-white cursor-pointer"
                />
                Afficher résolues
              </label>
            </div>

            {/* Alerts list */}
            <div className="space-y-2">
              {visibleAlerts.length === 0 ? (
                <div className="card p-8 text-center">
                  <p className="text-sm text-[#6b6b6b]">Aucune alerte correspondant aux filtres</p>
                </div>
              ) : (
                visibleAlerts.map((alert) => (
                  <AlertItem key={alert.id} alert={alert} onResolve={resolveAlert} />
                ))
              )}
            </div>
          </>
        ) : (
          <>
            {/* Alert rules */}
            <div className="space-y-3">
              <p className="text-xs text-[#6b6b6b]">
                {rules.length} règle{rules.length !== 1 ? 's' : ''} configurée{rules.length !== 1 ? 's' : ''}
              </p>
              {rules.map((rule) => (
                <RuleCard key={rule.id} rule={rule} />
              ))}
            </div>

            {/* Threshold config */}
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Seuils configurables</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label block mb-1.5">Délai de réponse max (ms)</label>
                  <input
                    type="number"
                    defaultValue={8000}
                    className="input w-full"
                    placeholder="8000"
                  />
                  <p className="text-[10px] text-[#6b6b6b] mt-1">Alerte si /status répond après ce délai</p>
                </div>
                <div>
                  <label className="label block mb-1.5">Échecs consécutifs avant alerte</label>
                  <input
                    type="number"
                    defaultValue={3}
                    className="input w-full"
                    placeholder="3"
                  />
                  <p className="text-[10px] text-[#6b6b6b] mt-1">Nombre de vérifications échouées avant alerte</p>
                </div>
                <div>
                  <label className="label block mb-1.5">Timeout vérification (ms)</label>
                  <input
                    type="number"
                    defaultValue={10000}
                    className="input w-full"
                    placeholder="10000"
                  />
                  <p className="text-[10px] text-[#6b6b6b] mt-1">Timeout réseau pour les requêtes /status</p>
                </div>
                <div>
                  <label className="label block mb-1.5">Inactivité max avant alerte (h)</label>
                  <input
                    type="number"
                    defaultValue={25}
                    className="input w-full"
                    placeholder="25"
                  />
                  <p className="text-[10px] text-[#6b6b6b] mt-1">Alerte si aucune exécution dans ce délai</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="btn-primary text-xs py-1.5">Sauvegarder</button>
                <button className="btn-secondary text-xs py-1.5">Réinitialiser</button>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  )
}
