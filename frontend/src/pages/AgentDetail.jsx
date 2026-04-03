import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { AgentDetailView } from '../components/agent/AgentDetail'
import { api } from '../lib/api'

export default function AgentDetailPage({ toggleMenu }) {
  const { id } = useParams()
  const [agent, setAgent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await api.getAgent(id)
        setAgent(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <>
        <Header title="Chargement..." onMenuToggle={toggleMenu} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-[#6b6b6b]">Chargement de l'agent...</p>
        </main>
      </>
    )
  }

  if (error || !agent) {
    return (
      <>
        <Header title="Erreur" onMenuToggle={toggleMenu} />
        <main className="flex-1 p-6">
          <div className="card p-6 text-center max-w-md mx-auto">
            <p className="text-sm text-[#ef4444] mb-4">
              {error || `Agent "${id}" introuvable`}
            </p>
            <Link to="/" className="btn-secondary inline-flex items-center gap-2">
              <ArrowLeft size={13} />
              Retour au dashboard
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header
        title={agent.name}
        subtitle={agent.description}
        onMenuToggle={toggleMenu}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#6b6b6b] hover:text-[#a1a1a1] transition-colors"
        >
          <ArrowLeft size={12} />
          Dashboard
        </Link>
        <AgentDetailView agent={agent} />
      </main>
    </>
  )
}
