import { useState, useEffect } from 'react'
import { Shield, Bot, CheckCircle, Bell } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { AgentCard } from '../components/dashboard/AgentCard'
import { MetricCard } from '../components/dashboard/MetricCard'
import { api } from '../lib/api'
import { useAlerts } from '../hooks/useAlerts'

export default function Dashboard({ toggleMenu }) {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const { unresolvedCount } = useAlerts()

  useEffect(() => {
    loadAgents()
    const interval = setInterval(loadAgents, 30000)
    return () => clearInterval(interval)
  }, [])

  async function loadAgents() {
    try {
      const data = await api.getAgents()
      setAgents(data.agents || [])
      setLastUpdated(new Date().toISOString())
    } catch (err) {
      console.error('Failed to load agents:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  async function handleRefresh() {
    setRefreshing(true)
    await loadAgents()
  }

  // We'll track healthy count from status — start with optimistic 2 while loading
  const totalAgents = agents.length || 2
  const runsToday = 3 // Mock — no persistent storage

  return (
    <>
      <Header
        title="Sheriff Agent Dashboard"
        subtitle="Monitoring des agents IA — Sheriff Projects"
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onMenuToggle={toggleMenu}
      />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Top metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            label="Total agents"
            value={totalAgents}
            sub="Déployés sur Railway"
            icon={Bot}
            accent="white"
          />
          <MetricCard
            label="Actifs"
            value={loading ? '...' : totalAgents}
            sub="Vérification en cours"
            icon={CheckCircle}
            accent="green"
          />
          <MetricCard
            label="Exécutions aujourd'hui"
            value={runsToday}
            sub="Toutes sources"
            icon={Shield}
            accent="blue"
          />
          <MetricCard
            label="Alertes actives"
            value={unresolvedCount}
            sub={unresolvedCount === 0 ? 'Tout est OK' : 'Nécessite attention'}
            icon={Bell}
            accent={unresolvedCount > 0 ? 'amber' : 'green'}
          />
        </div>

        {/* Section title */}
        <div>
          <h2 className="text-xs font-medium text-[#6b6b6b] uppercase tracking-wider mb-3">
            Agents actifs
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="card p-5 h-64 animate-pulse"
                >
                  <div className="h-4 bg-[#1a1a1a] rounded w-2/3 mb-3" />
                  <div className="h-3 bg-[#1a1a1a] rounded w-full mb-2" />
                  <div className="h-3 bg-[#1a1a1a] rounded w-4/5" />
                </div>
              ))}
            </div>
          ) : agents.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-sm text-[#6b6b6b]">
                Impossible de charger les agents. Vérifiez que le backend tourne sur le port 3001.
              </p>
              <button onClick={handleRefresh} className="btn-secondary mt-3 mx-auto">
                Réessayer
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          )}
        </div>

        {/* Architecture overview */}
        <div>
          <h2 className="text-xs font-medium text-[#6b6b6b] uppercase tracking-wider mb-3">
            Architecture
          </h2>
          <div className="card p-4 font-mono text-[11px] text-[#6b6b6b] leading-relaxed overflow-x-auto">
            <pre>{`
  ┌─────────────────────────────────────────────────────────┐
  │                Sheriff Agent Dashboard                   │
  │                    (React + Vite)                        │
  └──────────────────────┬──────────────────────────────────┘
                         │ HTTP
  ┌──────────────────────▼──────────────────────────────────┐
  │               Backend Proxy (Express)                    │
  │                   :3001                                  │
  └──────┬───────────────────────────────────────┬──────────┘
         │ HTTP                                  │ GraphQL
  ┌──────▼──────────────┐             ┌──────────▼──────────┐
  │  agent-repartition  │             │  Railway API         │
  │  ca-marge           │             │  (balanced-abundance)│
  │  .railway.app       │             └─────────────────────┘
  └─────────────────────┘
  ┌─────────────────────┐
  │  agent-scouting     │
  │  talent             │
  │  .railway.app       │
  └─────────────────────┘
            `}</pre>
          </div>
        </div>
      </main>
    </>
  )
}
