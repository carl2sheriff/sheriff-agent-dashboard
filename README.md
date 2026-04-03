# Sheriff Agent Dashboard

Interface de monitoring et contrôle des agents IA Sheriff Projects déployés sur Railway.

## Vue d'ensemble

Sheriff Agent Dashboard est une interface web permettant de surveiller, contrôler et diagnostiquer les agents IA Sheriff Projects. Il offre une vue en temps réel du statut des agents, un historique d'exécution, des logs, et des procédures opérationnelles.

```
Frontend (React/Vite) → Backend Proxy (Express) → Agents Railway
                                                 → Railway GraphQL API
```

## Agents monitorés

| Agent | Schedule | Intégrations | URL |
|-------|----------|--------------|-----|
| Répartition CA/Marge | Quotidien 8h | Slack, Google Sheets | agent-repartition-ca-marge-production.up.railway.app |
| Scouting Talent | Toutes les 24h | Slack, Google Drive | agent-scouting-talent-production.up.railway.app |

**Railway Project:** `balanced-abundance` (ID: `63830b39-2415-4c9e-ba52-79a6053a8dab`)

## Prérequis

- Node.js 18+
- npm ou yarn
- (Optionnel) Railway API Token pour l'intégration Railway

## Installation locale

### 1. Cloner le repo

```bash
git clone https://github.com/sheriff-projects/sheriff-agent-dashboard.git
cd sheriff-agent-dashboard
```

### 2. Installer les dépendances backend

```bash
cd backend && npm install
```

### 3. Installer les dépendances frontend

```bash
cd frontend && npm install
```

### 4. Configurer l'environnement

```bash
cp .env.example backend/.env
# Éditer backend/.env avec vos valeurs
```

### 5. Lancer le backend

```bash
cd backend && npm run dev
# → http://localhost:3001
```

### 6. Lancer le frontend

```bash
cd frontend && npm run dev
# → http://localhost:5173
```

## Variables d'environnement

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `PORT` | Non | Port backend (défaut: 3001) |
| `RAILWAY_API_TOKEN` | Non | Token API Railway pour l'intégration |
| `AGENT_CA_MARGE_URL` | Non | Override URL agent Répartition CA/Marge |
| `AGENT_SCOUTING_URL` | Non | Override URL agent Scouting Talent |
| `FRONTEND_URL` | Non | URL frontend (CORS) |
| `VITE_API_URL` | Non | URL backend depuis frontend (défaut: http://localhost:3001) |

## Endpoints de l'API backend

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/health` | Santé du backend |
| GET | `/api/agents` | Liste tous les agents |
| GET | `/api/agents/:id` | Config d'un agent |
| GET | `/api/agents/:id/status` | Statut live (proxy → /status) |
| POST | `/api/agents/:id/run` | Déclencher une exécution |
| GET | `/api/agents/:id/logs` | Logs de l'agent |
| GET | `/api/agents/:id/runs` | Historique d'exécution |
| POST | `/api/agents/:id/slack` | Envoyer une commande Slack |
| GET | `/api/railway/services` | Services Railway (GraphQL) |
| GET | `/api/railway/project` | Info projet Railway |

## Endpoints des agents

### Agent Répartition CA/Marge
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/status` | Statut de l'agent |

### Agent Scouting Talent
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/status` | Statut de l'agent |
| POST | `/slack/commands` | Commandes Slack (`/scouting-run`, `/scouting-status`) |

## Déploiement sur Railway

1. Créer un nouveau service sur Railway dans le projet `balanced-abundance`
2. Connecter ce repo GitHub
3. Railway détectera automatiquement `railway.toml`
4. Configurer les variables d'environnement :
   - `RAILWAY_API_TOKEN`
   - `FRONTEND_URL` (URL publique du frontend)
5. Déployer

## Structure du projet

```
sheriff-agent-dashboard/
├── frontend/          React + Vite + Tailwind
├── backend/           Express proxy server
├── docs/              Documentation
├── railway.toml       Config Railway
├── Dockerfile         Docker backend
└── .env.example       Template variables d'environnement
```

## Pages du dashboard

- **/** — Vue d'ensemble, cartes agents, métriques clés
- **/agents/:id** — Détail agent, logs, historique, actions
- **/ops** — Continuité opérationnelle, fiches, dépendances
- **/alerts** — Historique alertes, règles, seuils

## Contribution

1. Fork le repo
2. Créer une branche feature (`git checkout -b feature/mon-feature`)
3. Committer les changements (`git commit -m 'feat: ajouter mon feature'`)
4. Pusher la branche (`git push origin feature/mon-feature`)
5. Ouvrir une Pull Request
