# Architecture — Sheriff Agent Dashboard

## Vue d'ensemble

```
┌────────────────────────────────────────────────────────────────┐
│                    Utilisateur (navigateur)                     │
└──────────────────────────┬─────────────────────────────────────┘
                           │ HTTP :5173
┌──────────────────────────▼─────────────────────────────────────┐
│                     Frontend (React/Vite)                       │
│                                                                 │
│  Pages: Dashboard · AgentDetail · OpsView · AlertsView         │
│  Hooks: useAgentStatus (polling 30s) · useAlerts               │
│  Lib:   api.js (fetch wrapper) · utils.js                      │
└──────────────────────────┬─────────────────────────────────────┘
                           │ HTTP :3001
┌──────────────────────────▼─────────────────────────────────────┐
│                  Backend Proxy (Express.js)                     │
│                                                                 │
│  Routes: /api/agents · /api/railway                            │
│  Config: agents.js (config statique des agents)                │
│  Middleware: logger.js                                          │
└────────┬──────────────────────────────────────┬────────────────┘
         │ HTTP                                  │ HTTPS (GraphQL)
┌────────▼──────────────┐             ┌──────────▼───────────────┐
│  agent-repartition    │             │  Railway API              │
│  ca-marge.railway.app │             │  backboard.railway.app    │
│                       │             │  /graphql/v2              │
│  GET  /status         │             └──────────────────────────┘
└───────────────────────┘
┌───────────────────────┐
│  agent-scouting       │
│  talent.railway.app   │
│                       │
│  GET  /status         │
│  POST /slack/commands │
└───────────────────────┘
```

## Composants

### Frontend

| Composant | Rôle |
|-----------|------|
| `App.jsx` | Router principal, layout wrapping |
| `Layout.jsx` | Shell avec sidebar + gestion menu mobile |
| `Sidebar.jsx` | Navigation latérale, liens vers pages/agents |
| `Header.jsx` | Barre de titre par page, bouton refresh |
| `AgentCard.jsx` | Carte résumé agent (statut, métriques, actions rapides) |
| `MetricCard.jsx` | Carte métrique simple (chiffre + icône) |
| `StatusBadge.jsx` | Badge visuel healthy/degraded/down/unknown |
| `AgentDetail.jsx` | Vue complète agent (status, actions, onglets) |
| `LogViewer.jsx` | Viewer de logs avec filtres et autoscroll |
| `RunHistory.jsx` | Table historique d'exécution |
| `AgentFiche.jsx` | Fiche opérationnelle de continuité |
| `DependencyMatrix.jsx` | Table dépendances agents × services |
| `AlertItem.jsx` | Item d'alerte avec severity et résolution |

### Backend

| Fichier | Rôle |
|---------|------|
| `server.js` | Point d'entrée Express, CORS, routes, error handler |
| `routes/agents.js` | Endpoints /api/agents avec proxy vers agents Railway |
| `routes/railway.js` | Endpoints /api/railway avec GraphQL Railway API |
| `config/agents.js` | Config statique des 2 agents (URL, schedule, intégrations) |
| `middleware/logger.js` | Logger HTTP avec couleurs et durée |

## Flux de données

### Polling statut agent (toutes les 30s)
```
useAgentStatus(agentId)
  → GET /api/agents/:id/status
    → Express route
      → fetch(agentUrl/status, timeout: 10s)
        → Agent /status endpoint
          ← { status, httpStatus, responseTime }
        ← statusData
      ← proxied response
    ← { status, responseTime, lastChecked }
  ← hook state update → UI re-render
```

### Déclenchement manuel
```
Bouton "Lancer"
  → api.runAgent(id)
    → POST /api/agents/:id/run
      → fetch(agentUrl/run, method: POST)
        → Agent (if /run endpoint exists)
          ← response or error
        ← proxied or fallback response
      ← { triggered: true, timestamp }
    ← { ok: true }
  → UI feedback (toast-style banner)
```

### Commande Slack
```
Bouton "/scouting-run"
  → api.triggerSlackCommand(id, command)
    → POST /api/agents/:id/slack
      → { command, text, user_name }
        → fetch(agentUrl/slack/commands)
          → Agent route handler
            → Slack API call
          ← Slack response
        ← proxied response
      ← { command, response }
    ← slackResult state
  → UI feedback
```

## Décisions technologiques

| Choix | Raison |
|-------|--------|
| React + Vite | Build rapide, DX moderne, pas de boilerplate CRA |
| Tailwind CSS | Classes utilitaires cohérentes, pas de CSS custom |
| Express proxy | Évite CORS, centralise les appels, permet timeout custom |
| No TypeScript | Simplicité, vitesse d'itération |
| Recharts | Librairie charts React légère et composable |
| Lucide React | Icônes cohérentes, tree-shakeable |
| React Router v6 | Standard de facto pour routing React |
| Polling simple | Simple et fiable, pas besoin de WebSocket pour 2 agents |
| Mock data pour logs/runs | Les agents n'ont pas de stockage persistant |

## Sécurité

- Variables d'environnement jamais exposées côté frontend
- Les valeurs des env vars sont toujours redactées (`***`) dans les réponses API
- CORS restreint aux origines déclarées
- Timeout sur tous les appels aux agents (10-15s)
- Pas d'authentification dans cette version (dashboard interne)
