import { useState, useEffect, useRef } from 'react'
import { Terminal, RefreshCw, ChevronDown } from 'lucide-react'
import { api } from '../../lib/api'
import { formatDate } from '../../lib/utils'

const LEVEL_STYLES = {
  info: 'text-[#3b82f6]',
  warning: 'text-[#f59e0b]',
  error: 'text-[#ef4444]',
  debug: 'text-[#6b6b6b]',
}

const LEVEL_LABELS = {
  info: 'INFO',
  warning: 'WARN',
  error: 'ERR ',
  debug: 'DEBG',
}

export function LogViewer({ agentId }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [autoScroll, setAutoScroll] = useState(true)
  const [filter, setFilter] = useState('all')
  const bottomRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    fetchLogs()
  }, [agentId])

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, autoScroll])

  async function fetchLogs() {
    setLoading(true)
    try {
      const data = await api.getAgentLogs(agentId)
      setLogs(data.logs || [])
    } catch {
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  function handleScroll() {
    if (!containerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const atBottom = scrollHeight - scrollTop - clientHeight < 30
    setAutoScroll(atBottom)
  }

  const filteredLogs = filter === 'all' ? logs : logs.filter((l) => l.level === filter)

  return (
    <div className="flex flex-col h-64">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#0a0a0a] border-b border-[#222222] flex-shrink-0">
        <Terminal size={13} className="text-[#6b6b6b]" />
        <span className="text-xs text-[#6b6b6b] flex-1">Logs — {logs.length} entrées</span>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-[11px] bg-[#111111] border border-[#2a2a2a] text-[#a1a1a1] rounded px-2 py-1 outline-none"
        >
          <option value="all">Tous</option>
          <option value="error">Erreurs</option>
          <option value="warning">Avertissements</option>
          <option value="info">Info</option>
        </select>

        <button
          onClick={fetchLogs}
          className="text-[#6b6b6b] hover:text-white transition-colors"
          title="Actualiser"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>

        <button
          onClick={() => {
            setAutoScroll(true)
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
          }}
          title="Défiler vers le bas"
          className="text-[#6b6b6b] hover:text-white transition-colors"
        >
          <ChevronDown size={13} />
        </button>
      </div>

      {/* Log content */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-[#0a0a0a] font-mono text-[11px] leading-relaxed"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full text-[#6b6b6b]">
            Chargement des logs...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[#6b6b6b]">
            Aucun log disponible
          </div>
        ) : (
          <div className="p-3 space-y-0.5">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex gap-3 hover:bg-[#111111] px-1 py-0.5 rounded">
                <span className="text-[#6b6b6b] flex-shrink-0 w-36 truncate">
                  {new Date(log.timestamp).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
                <span className={`flex-shrink-0 w-10 font-semibold ${LEVEL_STYLES[log.level] || 'text-[#6b6b6b]'}`}>
                  {LEVEL_LABELS[log.level] || log.level.toUpperCase().padEnd(4)}
                </span>
                <span className="text-[#a1a1a1] break-all">{log.message}</span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  )
}
