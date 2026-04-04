# Sheriff Agent Dashboard

Dashboard web de monitoring et contrôle des agents IA Sheriff Projects déployés sur Railway.

## Architecture

```
backend/
  src/
    server.js           → Express app, routes, middleware
    routes/agents.js    → CRUD agents, status polling, trigger runs
    routes/railway.js   → Railway GraphQL API (services, deploys)
    config/agents.js    → Config hardcodée des agents (URLs, schedules)
    middleware/logger.js→ HTTP request logging
frontend/
  src/
    App.jsx             → React app, routing
    pages/Dashboard.jsx → Vue d'ensemble agents
    pages/AgentDetail.jsx→ Détail agent individuel
    pages/OpsView.jsx   → Procédures opérationnelles
    pages/AlertsView.jsx→ Alertes système
    hooks/useAgentStatus.js → Polling status 30s
    lib/api.js          → Client HTTP
```

## Stack

- **Frontend** : React 18 + Vite 5 + Tailwind CSS 3 + Recharts
- **Backend** : Express.js 4 + Node.js 18
- **Deploy** : Backend Docker → Railway / Frontend → Vercel

## Variables d'environnement

```
PORT=3001
NODE_ENV=development
RAILWAY_API_TOKEN=...          # Railway API (depuis railway.app/account/tokens)
FRONTEND_URL=https://...       # URL frontend pour CORS
VITE_API_URL=http://localhost:3001  # Pour le frontend
```

## Agents monitorés

| Agent | URL | Schedule | Intégrations |
|-------|-----|----------|--------------|
| Répartition CA/Marge | agent-repartition-ca-marge-production.up.railway.app | Daily 8h | Slack, Google Sheets |
| Scouting Talent | agent-scouting-talent-production.up.railway.app | Every 24h | Slack, Google Drive |

## Endpoints backend

| Method | Route | Description |
|--------|-------|-------------|
| GET | /health | Health check |
| GET | /api/agents | Liste agents |
| GET | /api/agents/:id/status | Status agent (proxy) |
| POST | /api/agents/:id/run | Trigger run agent |
| POST | /api/agents/:id/slack | Trigger commande Slack |
| GET | /api/railway/services | Services Railway via GraphQL |
| GET | /api/railway/project | Info projet Railway |

## Conventions

- JavaScript (pas TypeScript) — itérations rapides
- Pas d'auth utilisateur (dashboard interne)
- Polling 30s pour les status (simple et fiable)
- Logs et historique de runs sont mock data côté client
- CORS restreint à localhost + FRONTEND_URL
