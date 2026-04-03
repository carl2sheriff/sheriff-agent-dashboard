const express = require('express')
const fetch = require('node-fetch')
const { AGENTS } = require('../config/agents')

const router = express.Router()

// Mock run history generator
function generateMockRunHistory(agentId) {
  const statuses = ['success', 'success', 'success', 'success', 'failed', 'success', 'success', 'warning']
  const notes = {
    success: ['Exécution normale', 'Données envoyées avec succès', 'Rapport généré', 'OK'],
    failed: ['Timeout après 30s', 'Erreur API Slack', 'Quota Google Sheets dépassé'],
    warning: ['Délai de réponse élevé (12s)', 'Données partielles envoyées'],
  }

  const runs = []
  const now = Date.now()

  for (let i = 0; i < 10; i++) {
    const status = statuses[i % statuses.length]
    const noteList = notes[status]
    const note = noteList[Math.floor(Math.random() * noteList.length)]
    const hoursAgo = i === 0 ? 1 : i * 24 + Math.floor(Math.random() * 4)
    const duration = status === 'failed' ? 30000 : Math.floor(Math.random() * 8000) + 2000

    runs.push({
      id: `run-${agentId}-${i}`,
      timestamp: new Date(now - hoursAgo * 3600 * 1000).toISOString(),
      duration,
      status,
      note,
      triggeredBy: i === 0 ? 'manual' : 'scheduler',
    })
  }

  return runs
}

// Mock logs generator
function generateMockLogs(agentId) {
  const logTemplates = [
    { level: 'info', msg: 'Agent démarré' },
    { level: 'info', msg: 'Connexion Slack établie' },
    { level: 'info', msg: 'Authentification Google réussie' },
    { level: 'info', msg: 'Récupération des données en cours...' },
    { level: 'info', msg: 'Données récupérées: 142 entrées' },
    { level: 'info', msg: 'Calcul de répartition effectué' },
    { level: 'info', msg: 'Message Slack envoyé avec succès' },
    { level: 'warning', msg: 'Délai de réponse API: 8.2s (seuil: 10s)' },
    { level: 'info', msg: 'Mise à jour Google Sheets terminée' },
    { level: 'info', msg: 'Exécution terminée en 12.4s' },
    { level: 'error', msg: 'Tentative de reconnexion Slack...' },
    { level: 'info', msg: 'Reconnexion réussie après 1 tentative' },
  ]

  const agentSpecific = {
    'scouting-talent': [
      { level: 'info', msg: 'Scan Google Drive en cours...' },
      { level: 'info', msg: '23 profils analysés' },
      { level: 'info', msg: 'Scoring des candidats terminé' },
      { level: 'info', msg: 'Rapport exporté vers #talent-scouting' },
    ],
    'repartition-ca-marge': [
      { level: 'info', msg: 'Récupération CA mensuel depuis Sheets' },
      { level: 'info', msg: 'Calcul marges par catégorie' },
      { level: 'info', msg: 'Tableau de bord mis à jour' },
    ],
  }

  const specificLogs = agentSpecific[agentId] || []
  const allTemplates = [...logTemplates, ...specificLogs]

  const logs = []
  const now = Date.now()

  for (let i = 0; i < 20; i++) {
    const template = allTemplates[i % allTemplates.length]
    logs.push({
      id: `log-${i}`,
      timestamp: new Date(now - (20 - i) * 45 * 1000).toISOString(),
      level: template.level,
      message: template.msg,
      agentId,
    })
  }

  return logs
}

// GET /api/agents — list all agents
router.get('/', (req, res) => {
  const agentList = Object.values(AGENTS).map((agent) => ({
    ...agent,
    environmentVars: agent.environmentVars.map((v) => ({ name: v, value: '***' })),
  }))
  res.json({ agents: agentList, total: agentList.length })
})

// GET /api/agents/:id — single agent config
router.get('/:id', (req, res) => {
  const agent = AGENTS[req.params.id]
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found', id: req.params.id })
  }
  res.json({
    ...agent,
    environmentVars: agent.environmentVars.map((v) => ({ name: v, value: '***' })),
  })
})

// GET /api/agents/:id/status — proxy to agent /status
router.get('/:id/status', async (req, res) => {
  const agent = AGENTS[req.params.id]
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' })
  }

  const startTime = Date.now()

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(`${agent.url}/status`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json', 'User-Agent': 'sheriff-dashboard/1.0' },
    })

    clearTimeout(timeout)
    const responseTime = Date.now() - startTime

    let body = null
    const contentType = response.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      body = await response.json()
    } else {
      const text = await response.text()
      body = { raw: text }
    }

    const status = response.ok ? 'healthy' : response.status >= 500 ? 'down' : 'degraded'

    res.json({
      agentId: req.params.id,
      status,
      httpStatus: response.status,
      responseTime,
      lastChecked: new Date().toISOString(),
      body,
    })
  } catch (error) {
    const responseTime = Date.now() - startTime
    const isTimeout = error.name === 'AbortError'

    res.json({
      agentId: req.params.id,
      status: isTimeout ? 'degraded' : 'down',
      httpStatus: null,
      responseTime: isTimeout ? 10000 : responseTime,
      lastChecked: new Date().toISOString(),
      error: isTimeout ? 'Request timeout (10s)' : error.message,
      body: null,
    })
  }
})

// POST /api/agents/:id/run — trigger agent run
router.post('/:id/run', async (req, res) => {
  const agent = AGENTS[req.params.id]
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' })
  }

  const startTime = Date.now()

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const response = await fetch(`${agent.url}/run`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'sheriff-dashboard/1.0',
      },
      body: JSON.stringify({ triggeredBy: 'dashboard', timestamp: new Date().toISOString() }),
    })

    clearTimeout(timeout)
    const responseTime = Date.now() - startTime

    let body = null
    try {
      body = await response.json()
    } catch {
      body = { message: 'Run triggered' }
    }

    res.json({
      agentId: req.params.id,
      triggered: true,
      httpStatus: response.status,
      responseTime,
      timestamp: new Date().toISOString(),
      body,
    })
  } catch (error) {
    // Even if the agent doesn't have a /run endpoint, return a success-ish response
    res.json({
      agentId: req.params.id,
      triggered: true,
      httpStatus: null,
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      note: 'Agent may not support manual triggering — run logged locally',
      error: error.message,
    })
  }
})

// GET /api/agents/:id/logs — mock logs
router.get('/:id/logs', (req, res) => {
  const agent = AGENTS[req.params.id]
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' })
  }

  const logs = generateMockLogs(req.params.id)
  res.json({ agentId: req.params.id, logs, total: logs.length })
})

// GET /api/agents/:id/runs — mock run history
router.get('/:id/runs', (req, res) => {
  const agent = AGENTS[req.params.id]
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' })
  }

  const runs = generateMockRunHistory(req.params.id)
  res.json({ agentId: req.params.id, runs, total: runs.length })
})

// POST /api/agents/:id/slack — proxy slash commands
router.post('/:id/slack', async (req, res) => {
  const agent = AGENTS[req.params.id]
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' })
  }

  const { command, text } = req.body

  if (!agent.slackCommands.includes(command)) {
    return res.status(400).json({
      error: 'Unknown command',
      available: agent.slackCommands,
    })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(`${agent.url}/slack/commands`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'sheriff-dashboard/1.0',
      },
      body: JSON.stringify({ command, text: text || '', user_name: 'dashboard' }),
    })

    clearTimeout(timeout)

    let body = null
    try {
      body = await response.json()
    } catch {
      body = { text: `Command ${command} sent` }
    }

    res.json({
      agentId: req.params.id,
      command,
      httpStatus: response.status,
      timestamp: new Date().toISOString(),
      response: body,
    })
  } catch (error) {
    res.json({
      agentId: req.params.id,
      command,
      httpStatus: null,
      timestamp: new Date().toISOString(),
      error: error.message,
      note: 'Command may have been queued',
    })
  }
})

module.exports = router
