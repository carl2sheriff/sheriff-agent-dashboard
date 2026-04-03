import { useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { AgentFiche } from '../components/ops/AgentFiche'
import { DependencyMatrix } from '../components/ops/DependencyMatrix'
import { api } from '../lib/api'

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xs font-medium text-[#6b6b6b] uppercase tracking-wider mb-3">{title}</h2>
      {children}
    </div>
  )
}

const EMERGENCY_PROCEDURES = [
  {
    title: 'Agent hors ligne',
    steps: [
      'Vérifier le statut de déploiement sur Railway (balanced-abundance)',
      'Consulter les logs de build sur Railway Dashboard',
      "Déclencher un redéploiement depuis Sheriff Dashboard (bouton 'Redémarrer')",
      'Attendre 60s et vérifier GET /status',
      "Si l'agent ne redémarre pas, vérifier les variables d'environnement sur Railway",
      'Contacter Sheriff Projects si le problème persiste',
    ],
  },
  {
    title: "Échec d'intégration Slack",
    steps: [
      "Vérifier que le token SLACK_BOT_TOKEN n'a pas expiré",
      'Confirmer que le bot est toujours membre du channel cible',
      "Régénérer le token sur api.slack.com si nécessaire",
      'Mettre à jour la variable SLACK_BOT_TOKEN sur Railway',
      "Redémarrer l'agent après mise à jour",
      'Tester avec une exécution manuelle',
    ],
  },
  {
    title: 'Accès Google Sheets / Drive révoqué',
    steps: [
      "Vérifier les droits du service account sur Google Cloud Console",
      'Confirmer que le service account a accès au fichier/dossier cible',
      'Re-partager le fichier avec le service account si nécessaire',
      'Vérifier que la clé GOOGLE_SERVICE_ACCOUNT_KEY est à jour',
      "Si la clé a expiré, créer une nouvelle clé sur Google Cloud et mettre à jour l'env var",
      "Redémarrer l'agent et vérifier les logs",
    ],
  },
]

export default function OpsView({ toggleMenu }) {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getAgents()
        setAgents(data.agents || [])
      } catch {
        setAgents([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <>
      <Header
        title="Continuité Opérationnelle"
        subtitle="Fiches agents, dépendances et procédures d'urgence"
        onMenuToggle={toggleMenu}
      />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">
        {/* Agent fiches */}
        <Section title="Fiches agents">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="card p-5 h-64 animate-pulse">
                  <div className="h-4 bg-[#1a1a1a] rounded w-2/3 mb-3" />
                  <div className="h-3 bg-[#1a1a1a] rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent) => (
                <AgentFiche key={agent.id} agent={agent} />
              ))}
            </div>
          )}
        </Section>

        {/* Dependency matrix */}
        <Section title="Matrice de dépendances">
          <div className="card overflow-hidden">
            <DependencyMatrix />
          </div>
        </Section>

        {/* Architecture diagram */}
        <Section title="Diagramme d'architecture">
          <div className="card p-5 font-mono text-[11px] text-[#6b6b6b] leading-relaxed overflow-x-auto">
            <pre className="whitespace-pre">{`
  Déclencheurs                Agents (Railway)              Destinations
  ─────────────               ─────────────────             ─────────────

  Cron (8h00)  ──────────►  agent-repartition       ──────► #finance (Slack)
                             ca-marge                ──────► Google Sheets
                             .railway.app

  Cron (24h)   ──────────►  agent-scouting-talent   ──────► #talent-scouting (Slack)
                             .railway.app            ──────► Google Drive

  Dashboard    ──────────►  [les deux agents]        ──────► (même que ci-dessus)
  (manuel)

  Slack cmd    ──────────►  agent-scouting-talent    ──────► #talent-scouting (Slack)
  /scouting-*               /slack/commands

  ─────────────────────────────────────────────────────────────────────────────

  Sheriff Dashboard (this app)
  ├── Frontend (React/Vite) :5173
  └── Backend Proxy (Express) :3001
      ├── GET  /api/agents          → Config locale
      ├── GET  /api/agents/:id/status → Proxy → /status
      ├── POST /api/agents/:id/run  → Proxy → /run
      ├── POST /api/agents/:id/slack → Proxy → /slack/commands
      └── GET  /api/railway/services → Railway GraphQL API
            `}</pre>
          </div>
        </Section>

        {/* Emergency procedures */}
        <Section title="Procédures d'urgence">
          <div className="space-y-3">
            {EMERGENCY_PROCEDURES.map((proc, i) => (
              <div key={i} className="card p-4">
                <h4 className="text-sm font-semibold text-white mb-3">{proc.title}</h4>
                <ol className="space-y-2">
                  {proc.steps.map((step, j) => (
                    <li key={j} className="flex gap-3 text-xs">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[10px] text-[#6b6b6b] font-mono">
                        {j + 1}
                      </span>
                      <span className="text-[#a1a1a1] pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Section>

        {/* Monitoring checklist */}
        <Section title="Checklist de monitoring quotidien">
          <div className="card p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Vérifier statut des 2 agents (vert = OK)',
                "Confirmer l'exécution du rapport CA/Marge dans #finance",
                "Confirmer l'exécution du scouting dans #talent-scouting",
                'Vérifier absence d\'alertes non résolues',
                'Contrôler les temps de réponse (< 5s idéal)',
                'Vérifier les logs pour erreurs répétées',
              ].map((item, i) => (
                <label key={i} className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mt-0.5 w-3.5 h-3.5 rounded border-[#2a2a2a] bg-[#111111] accent-white cursor-pointer"
                  />
                  <span className="text-xs text-[#a1a1a1] group-hover:text-white transition-colors">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </Section>
      </main>
    </>
  )
}
