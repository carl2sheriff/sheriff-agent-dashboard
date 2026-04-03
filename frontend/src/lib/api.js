const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    throw new Error(error.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  getAgents: () =>
    fetch(`${BASE_URL}/api/agents`).then(handleResponse),

  getAgent: (id) =>
    fetch(`${BASE_URL}/api/agents/${id}`).then(handleResponse),

  getAgentStatus: (id) =>
    fetch(`${BASE_URL}/api/agents/${id}/status`).then(handleResponse),

  runAgent: (id) =>
    fetch(`${BASE_URL}/api/agents/${id}/run`, { method: 'POST' }).then(handleResponse),

  getAgentLogs: (id) =>
    fetch(`${BASE_URL}/api/agents/${id}/logs`).then(handleResponse),

  getAgentRuns: (id) =>
    fetch(`${BASE_URL}/api/agents/${id}/runs`).then(handleResponse),

  getRailwayServices: () =>
    fetch(`${BASE_URL}/api/railway/services`).then(handleResponse),

  getRailwayProject: () =>
    fetch(`${BASE_URL}/api/railway/project`).then(handleResponse),

  triggerSlackCommand: (id, command, text = '') =>
    fetch(`${BASE_URL}/api/agents/${id}/slack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command, text }),
    }).then(handleResponse),
}

export default api
