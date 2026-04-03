import { useState, useEffect } from 'react'

// Mock alert data — replace with real API when available
const MOCK_ALERTS = [
  {
    id: 'alert-001',
    timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    agentId: 'scouting-talent',
    agentName: 'Agent Scouting Talent',
    type: 'status_check',
    severity: 'error',
    message: '/status a retourné 503 — service temporairement indisponible',
    resolved: true,
    resolvedAt: new Date(Date.now() - 0.5 * 3600 * 1000).toISOString(),
  },
  {
    id: 'alert-002',
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    agentId: 'repartition-ca-marge',
    agentName: 'Agent Répartition CA/Marge',
    type: 'response_time',
    severity: 'warning',
    message: 'Délai de réponse élevé: 9.8s (seuil: 8s)',
    resolved: true,
    resolvedAt: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
  },
  {
    id: 'alert-003',
    timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    agentId: 'scouting-talent',
    agentName: 'Agent Scouting Talent',
    type: 'run_failure',
    severity: 'error',
    message: 'Exécution échouée après 3 tentatives — timeout API Google Drive',
    resolved: true,
    resolvedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: 'alert-004',
    timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    agentId: 'repartition-ca-marge',
    agentName: 'Agent Répartition CA/Marge',
    type: 'schedule_missed',
    severity: 'warning',
    message: "L'agent n'a pas tourné depuis plus de 25h (schedule: 24h)",
    resolved: true,
    resolvedAt: new Date(Date.now() - 11 * 3600 * 1000).toISOString(),
  },
  {
    id: 'alert-005',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    agentId: 'scouting-talent',
    agentName: 'Agent Scouting Talent',
    type: 'status_check',
    severity: 'info',
    message: 'Redémarrage automatique détecté — agent de retour en ligne',
    resolved: true,
    resolvedAt: new Date(Date.now() - 23.8 * 3600 * 1000).toISOString(),
  },
  {
    id: 'alert-006',
    timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    agentId: 'repartition-ca-marge',
    agentName: 'Agent Répartition CA/Marge',
    type: 'integration_error',
    severity: 'error',
    message: "Erreur d'authentification Slack — token expiré",
    resolved: true,
    resolvedAt: new Date(Date.now() - 1.9 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'alert-007',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    agentId: 'scouting-talent',
    agentName: 'Agent Scouting Talent',
    type: 'response_time',
    severity: 'warning',
    message: 'Délai de réponse: 7.2s — approche du seuil critique (8s)',
    resolved: false,
    resolvedAt: null,
  },
]

const ALERT_RULES = [
  {
    id: 'rule-001',
    name: 'Status non-200 consécutifs',
    description: 'Alerte si /status retourne un code non-200 pendant 3 vérifications consécutives',
    severity: 'error',
    condition: 'consecutive_failures >= 3',
    agents: ['all'],
    enabled: true,
  },
  {
    id: 'rule-002',
    name: 'Agent inactif trop longtemps',
    description: "Alerte si l'agent n'a pas tourné depuis plus de 25h (schedule: 24h)",
    severity: 'warning',
    condition: 'hours_since_last_run > 25',
    agents: ['scouting-talent'],
    enabled: true,
  },
  {
    id: 'rule-003',
    name: 'Agent inactif trop longtemps',
    description: "Alerte si l'agent n'a pas tourné depuis plus de 28h (schedule: 8h quotidien)",
    severity: 'warning',
    condition: 'hours_since_last_run > 28',
    agents: ['repartition-ca-marge'],
    enabled: true,
  },
  {
    id: 'rule-004',
    name: 'Délai de réponse élevé',
    description: 'Alerte si le délai de réponse /status dépasse 8 secondes',
    severity: 'warning',
    condition: 'response_time_ms > 8000',
    agents: ['all'],
    enabled: true,
  },
  {
    id: 'rule-005',
    name: 'Timeout complet',
    description: "Alerte si /status ne répond pas dans les 10 secondes (timeout réseau)",
    severity: 'error',
    condition: 'response_time_ms >= 10000 OR network_error',
    agents: ['all'],
    enabled: true,
  },
]

export function useAlerts({ agentFilter = 'all', severityFilter = 'all' } = {}) {
  const [alerts, setAlerts] = useState(MOCK_ALERTS)
  const [rules] = useState(ALERT_RULES)
  const [loading] = useState(false)

  const filteredAlerts = alerts.filter((alert) => {
    if (agentFilter !== 'all' && alert.agentId !== agentFilter) return false
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false
    return true
  })

  const unresolvedCount = alerts.filter((a) => !a.resolved).length
  const totalCount = alerts.length

  const resolveAlert = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true, resolvedAt: new Date().toISOString() } : a))
    )
  }

  return {
    alerts: filteredAlerts,
    rules,
    loading,
    unresolvedCount,
    totalCount,
    resolveAlert,
  }
}
