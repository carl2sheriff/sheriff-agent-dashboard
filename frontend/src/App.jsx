'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Clock,
  Code2,
  Database,
  ExternalLink,
  Github,
  Home,
  Radio,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Search,
} from 'lucide-react';

const COLORS = ['#000000', '#4a4a4a', '#808080', '#b0b0b0'];

const agents = [
  {
    id: 'ca-marge',
    name: 'agent-repartition-ca-marge',
    language: 'Python',
    platform: 'Railway',
    status: 'online',
    lastRun: '2026-04-03 02:30 UTC',
    nextRun: '2026-04-08 18:00 (Tue 19:00 Paris)',
    uptime: '99.8%',
    description: 'Calculates CA & Marge repartition by Business Unit. Fetches from Digifactory, generates .xlsx, uploads to Google Drive, sends Slack notification.',
    trigger: 'Cron every Tuesday 19h (Europe/Paris) via APScheduler',
    integrations: ['Digifactory API', 'Google Drive', 'Slack'],
    endpoints: [
      { method: 'GET', path: '/', description: 'Health check' },
      { method: 'POST', path: '/run', description: 'Manual trigger' },
      { method: 'GET', path: '/status', description: 'Last run status' },
      { method: 'POST', path: '/slack-run', description: 'Slack slash command' },
    ],
    businessUnits: [
      'BU02 Atelier-Capture',
      'BU07 Art Lab',
      'BU06 Post-Prod Special Projects',
      'BU05 Post-Prod Pub Photo',
      'MAGIC 3D',
      'BU10 Ultra Motion',
      'BU11 Production',
      'Sheriff Gallery',
      'Sheriff London',
      'Finance',
      'Contribution Carbone',
    ],
    envVars: [
      { name: 'DIGIFACTORY_TOKEN', value: '••••••••' },
      { name: 'DIGIFACTORY_URL', value: 'https://api.digifactory.com' },
      { name: 'SLACK_WEBHOOK_URL', value: '••••••••' },
      { name: 'SLACK_SIGNING_SECRET', value: '••••••••' },
      { name: 'GDRIVE_FOLDER_ID', value: '••••••••' },
      { name: 'GOOGLE_SERVICE_ACCOUNT_JSON', value: '••••••••' },
      { name: 'CRON_ENABLED', value: 'true' },
      { name: 'PORT', value: '3000' },
    ],
    github: 'https://github.com/carl2sheriff/agent-repartition-ca-marge',
    railway: 'https://railway.com/project/265292e7-5c0d-4773-83d5-9ec99489aae1',
    slack: '#ca-marge-reports',
    commits: 15,
    lastCommit: 'Refonte esthétique messages Slack',
    lastCommitDate: '2026-04-02',
  },
  {
    id: 'invoice-bot',
    name: 'sheriff-invoice-bot',
    language: 'Node.js',
    platform: 'Railway',
    status: 'online',
    lastRun: '2026-04-03 16:45 UTC',
    nextRun: 'On-demand (Slack)',
    uptime: '99.9%',
    description: 'Validates invoices against client-specific billing rules. Checks échéance dates, 60-day model, carbon contribution, VAT routing, IBAN, and UK entity rules.',
    trigger: 'Webhook Slack (on-demand via Slack commands)',
    integrations: ['Slack API', 'Digifactory', 'Pennylane'],
    endpoints: [
      { method: 'POST', path: '/validate', description: 'Validate invoice' },
      { method: 'POST', path: '/slack', description: 'Slack webhook' },
      { method: 'GET', path: '/health', description: 'Health check' },
    ],
    clientRules: [
      { client: 'Christian Dior Couture', echéance: '60j', modèle60j: 'Yes', carbone: 'No', entité: 'Sheriff Projects' },
      { client: 'Parfums Christian Dior', echéance: '60j', modèle60j: 'Yes', carbone: 'No', entité: 'Sheriff Projects' },
      { client: 'Kenzo', echéance: '60j', modèle60j: 'Yes', carbone: 'Yes', entité: 'Sheriff Projects' },
      { client: 'Louis Vuitton', echéance: '45j', modèle60j: 'No', carbone: 'No', entité: 'Sheriff Projects' },
      { client: 'Balenciaga', echéance: '60j', modèle60j: 'Yes', carbone: 'No', entité: 'Sheriff Projects' },
      { client: 'Puig France', echéance: '60j', modèle60j: 'Yes', carbone: 'Yes', entité: 'Sheriff Projects' },
      { client: 'WSM', echéance: '45j', modèle60j: 'No', carbone: 'No', entité: 'Sheriff Projects' },
      { client: 'Publicis', echéance: '45j', modèle60j: 'No', carbone: 'No', entité: 'Sheriff Projects' },
      { client: 'Bash', echéance: 'Reception', modèle60j: 'No', carbone: 'No', entité: 'Sheriff Projects' },
      { client: 'Kitten', echéance: '60j', modèle60j: 'Yes', carbone: 'No', entité: 'Sheriff Projects UK Ltd' },
      { client: 'MAP', echéance: '60j', modèle60j: 'Yes', carbone: 'No', entité: 'Sheriff Projects UK Ltd' },
      { client: 'MAP NY', echéance: '60j', modèle60j: 'Yes', carbone: 'No', entité: 'Sheriff Projects UK Ltd' },
      { client: 'CBA', echéance: '60j', modèle60j: 'Yes', carbone: 'No', entité: 'Sheriff Projects UK Ltd' },
    ],
    envVars: [
      { name: 'SLACK_BOT_TOKEN', value: '••••••••' },
      { name: 'SLACK_SIGNING_SECRET', value: '••••••••' },
      { name: 'OPENAI_API_KEY', value: '••••••••' },
      { name: 'NODE_ENV', value: 'production' },
    ],
    github: 'https://github.com/carl2sheriff/sheriff-invoice-bot',
    railway: 'https://railway.com/project/sheriff-invoice-bot',
    slack: '#validation-factures-digi',
    commits: 42,
    lastCommit: 'Add new clients with specific conditions - Add Balenciaga and Puig',
    lastCommitDate: '2026-04-03',
  },
  {
    id: 'scouting',
    name: 'agent-scouting-talent',
    language: 'Node.js',
    platform: 'Railway',
    status: 'setup',
    lastRun: 'N/A',
    nextRun: 'Planned',
    uptime: 'N/A',
    description: 'Scrapes and analyzes freelance profiles. Identifies top talent, sends recommendations to Slack, archives profiles in Google Drive and Google Sheets.',
    trigger: 'Scheduled (planned)',
    integrations: ['Slack API (OAuth pending)', 'Google Drive', 'Google Sheets'],
    endpoints: [
      { method: 'POST', path: '/scrape', description: 'Start scraping job' },
      { method: 'GET', path: '/status', description: 'Job status' },
    ],
    envVars: [
      { name: 'SLACK_BOT_TOKEN', value: '••••••••' },
      { name: 'GOOGLE_DRIVE_FOLDER', value: '••••••••' },
      { name: 'SCRAPING_API_KEY', value: '••••••••' },
      { name: 'OPENAI_API_KEY', value: '••••••••' },
    ],
    github: 'https://github.com/carl2sheriff/agent-scouting-talent',
    railway: 'https://railway.com/project/agent-scouting-talent',
    slack: '#talent-scouting',
    commits: 8,
    lastCommit: 'Initial setup',
    lastCommitDate: '2026-03-15',
  },
];

const performanceData = [
  { time: 'Mon', 'ca-marge': 98.5, 'invoice-bot': 99.8, 'scouting': 0 },
  { time: 'Tue', 'ca-marge': 99.2, 'invoice-bot': 99.9, 'scouting': 0 },
  { time: 'Wed', 'ca-marge': 98.8, 'invoice-bot': 99.7, 'scouting': 0 },
  { time: 'Thu', 'ca-marge': 99.1, 'invoice-bot': 99.6, 'scouting': 0 },
  { time: 'Fri', 'ca-marge': 99.8, 'invoice-bot': 99.9, 'scouting': 0 },
  { time: 'Sat', 'ca-marge': 98.9, 'invoice-bot': 99.8, 'scouting': 0 },
  { time: 'Sun', 'ca-marge': 99.3, 'invoice-bot': 99.9, 'scouting': 0 },
];

const agentStatusData = [
  { name: 'Online', value: 2, fill: '#000000' },
  { name: 'Setup', value: 1, fill: '#d4a574' },
];

const continuityOpsData = [
  {
    category: 'Data Integrity',
    items: [
      'CA/Marge: Bi-weekly BU repartition validation via audit log',
      'Invoice Bot: Real-time rule enforcement on all clients',
      'All agents: Webhook retry mechanism with exponential backoff',
    ],
  },
  {
    category: 'Integration Points',
    items: [
      'Digifactory API: Direct integration with Sheriff production database',
      'Google Drive: Shared Drive for report storage with version control',
      'Slack: Incoming webhooks + slash commands for manual triggers',
      'Pennylane: Invoice validation against current client rules',
    ],
  },
  {
    category: 'Business Units',
    items: [
      'CA/Marge tracks 11 BUs: Atelier-Capture, Art Lab, Post-Prod, Motion, Production, Gallery, Finance, etc.',
      'Finance BU: Receives consolidated monthly reports',
      'Sheriff London: Tracked separately for UK operations',
    ],
  },
];

const AlertBadge = ({ status }) => {
  if (status === 'online') {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-black text-white rounded-full text-xs font-medium">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        Online
      </div>
    );
  }
  if (status === 'setup') {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-medium">
        <div className="w-2 h-2 bg-amber-600 rounded-full" />
        En config
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-900 rounded-full text-xs font-medium">
      <div className="w-2 h-2 bg-red-600 rounded-full" />
      Offline
    </div>
  );
};

const DashboardView = ({ onSelectAgent }) => {
  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2">Total Agents</p>
              <p className="text-3xl font-light">3</p>
            </div>
            <Code2 size={20} className="text-gray-400" strokeWidth={1.5} />
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2">Online</p>
              <p className="text-3xl font-light">2</p>
            </div>
            <Radio size={20} className="text-green-600" strokeWidth={1.5} />
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2">Avg Uptime</p>
              <p className="text-3xl font-light">99.6%</p>
            </div>
            <Activity size={20} className="text-gray-400" strokeWidth={1.5} />
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2">Integrations</p>
              <p className="text-3xl font-light">9</p>
            </div>
            <Zap size={20} className="text-gray-400" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Agent Status Cards */}
      <div>
        <h2 className="text-lg font-light mb-4">Deployed Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              className="text-left border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{agent.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{agent.language} • {agent.platform}</p>
                </div>
                <AlertBadge status={agent.status} />
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{agent.description}</p>
              <div className="flex items-center text-gray-400 text-sm">
                <span>View details</span>
                <ArrowRight size={14} className="ml-2" strokeWidth={1.5} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Performance Chart */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-light mb-6">7-Day Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
              }}
              cursor={{ stroke: '#e5e7eb' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="ca-marge"
              stroke="#000000"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="invoice-bot"
              stroke="#808080"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Status Distribution */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-light mb-6">Agent Status Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={agentStatusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {agentStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const AgentDetailView = ({ agentId, onBack }) => {
  const agent = agents.find((a) => a.id === agentId);
  if (!agent) return <div>Agent not found</div>;

  const isSetup = agent.status === 'setup';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm"
        >
          <ArrowRight size={16} strokeWidth={1.5} className="rotate-180" />
          Back to Dashboard
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-light mb-2">{agent.name}</h1>
            <p className="text-gray-600">{agent.language} • {agent.platform}</p>
          </div>
          <AlertBadge status={agent.status} />
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Last Run</p>
          <p className="font-medium text-gray-900">{agent.lastRun}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Next Run</p>
          <p className="font-medium text-gray-900 text-sm">{agent.nextRun}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Uptime</p>
          <p className="font-medium text-gray-900">{agent.uptime}</p>
        </div>
      </div>

      {/* Description */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-light mb-4">Overview</h2>
        <p className="text-gray-700 leading-relaxed mb-4">{agent.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 mb-1">Trigger</p>
            <p className="font-medium text-gray-900">{agent.trigger}</p>
          </div>
        </div>
      </div>

      {/* External Links */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-light mb-4">External Links</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href={agent.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Github size={16} strokeWidth={1.5} />
            GitHub Repository
            <ExternalLink size={14} strokeWidth={1.5} />
          </a>
          <a
            href={agent.railway}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Radio size={16} strokeWidth={1.5} />
            Railway Dashboard
            <ExternalLink size={14} strokeWidth={1.5} />
          </a>
          <a
            href={`https://slack.com/app_redirect?channel=${agent.slack.replace('#', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Zap size={16} strokeWidth={1.5} />
            Slack Channel
            <ExternalLink size={14} strokeWidth={1.5} />
          </a>
        </div>
      </div>

      {/* Integrations */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-light mb-4">Integrations</h2>
        <div className="flex flex-wrap gap-2">
          {agent.integrations.map((integration) => (
            <span
              key={integration}
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
            >
              {integration}
            </span>
          ))}
        </div>
      </div>

      {/* Endpoints */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-light mb-4">API Endpoints</h2>
        <div className="space-y-3">
          {agent.endpoints.map((endpoint, idx) => (
            <div key={idx} className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-b-0">
              <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded whitespace-nowrap">
                {endpoint.method}
              </span>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{endpoint.path}</p>
                <p className="text-gray-600 text-sm">{endpoint.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client Rules - Invoice Bot Only */}
      {agent.id === 'invoice-bot' && agent.clientRules && (
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-light mb-4">Client Billing Rules</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Client</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Échéance</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Modèle 60j</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Carbone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Entité</th>
                </tr>
              </thead>
              <tbody>
                {agent.clientRules.map((rule, idx) => (
                  <tr key={idx} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-3 px-4 text-gray-900 font-medium">{rule.client}</td>
                    <td className="py-3 px-4 text-gray-700">{rule.echéance}</td>
                    <td className="py-3 px-4">
                      <span className={rule.modèle60j === 'Yes' ? 'text-gray-900' : 'text-gray-400'}>
                        {rule.modèle60j}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={rule.carbone === 'Yes' ? 'text-gray-900' : 'text-gray-400'}>
                        {rule.carbone}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{rule.entité}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Business Units - CA/Marge Only */}
      {agent.id === 'ca-marge' && agent.businessUnits && (
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-light mb-4">Tracked Business Units</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {agent.businessUnits.map((bu) => (
              <div key={bu} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                <span className="text-gray-900">{bu}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Environment Variables */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-light mb-4">Environment Variables</h2>
        <div className="space-y-3">
          {agent.envVars.map((envVar, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg border border-gray-100">
              <span className="font-mono text-sm text-gray-900">{envVar.name}</span>
              <span className="font-mono text-sm text-gray-400">{envVar.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub Info */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-light mb-4">Repository Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Commits</p>
            <p className="text-2xl font-light text-gray-900">{agent.commits}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Last Commit</p>
            <p className="font-medium text-gray-900">{agent.lastCommit}</p>
            <p className="text-sm text-gray-500 mt-1">{agent.lastCommitDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContinuityOpsView = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light mb-2">Continuity Operations</h1>
        <p className="text-gray-600">Critical integrations and data integrity protocols</p>
      </div>

      {continuityOpsData.map((section) => (
        <div key={section.category} className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-light mb-4">{section.category}</h2>
          <ul className="space-y-3">
            {section.items.map((item, idx) => (
              <li key={idx} className="flex gap-4">
                <div className="w-2 h-2 mt-2 bg-gray-400 rounded-full flex-shrink-0" />
                <span className="text-gray-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const AlertsView = () => {
  const alerts = [
    {
      id: 1,
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'CA/Marge agent will run on Tuesday, Apr 8 at 19:00 (Paris time)',
      timestamp: '2 days away',
    },
    {
      id: 2,
      type: 'warning',
      title: 'Setup in Progress',
      message: 'agent-scouting-talent: OAuth integration pending with Slack',
      timestamp: 'Active',
    },
    {
      id: 3,
      type: 'success',
      title: 'High Uptime Achieved',
      message: 'Invoice Bot reached 99.9% uptime this week',
      timestamp: '1 hour ago',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light mb-2">Alerts & Notifications</h1>
        <p className="text-gray-600">System status and important notifications</p>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          let icon;
          let bgColor;
          let borderColor;
          let textColor;

          if (alert.type === 'success') {
            icon = <CheckCircle2 size={20} className="text-green-600" strokeWidth={1.5} />;
            bgColor = 'bg-green-50';
            borderColor = 'border-green-200';
          } else if (alert.type === 'warning') {
            icon = <AlertTriangle size={20} className="text-amber-600" strokeWidth={1.5} />;
            bgColor = 'bg-amber-50';
            borderColor = 'border-amber-200';
          } else {
            icon = <AlertCircle size={20} className="text-blue-600" strokeWidth={1.5} />;
            bgColor = 'bg-blue-50';
            borderColor = 'border-blue-200';
          }

          return (
            <div key={alert.id} className={`${bgColor} ${borderColor} border rounded-lg p-4`}>
              <div className="flex gap-4">
                {icon}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{alert.title}</p>
                  <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{alert.timestamp}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedAgent, setSelectedAgent] = useState(null);

  const handleSelectAgent = (agentId) => {
    setSelectedAgent(agentId);
    setCurrentView('detail');
  };

  const handleBack = () => {
    setCurrentView('dashboard');
    setSelectedAgent(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Code2 size={20} className="text-white" strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-light">Sheriff Agent Command Center</h1>
            </div>
            <nav className="flex gap-1">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home size={16} className="inline mr-2" strokeWidth={1.5} />
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('ops')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  currentView === 'ops'
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Settings size={16} className="inline mr-2" strokeWidth={1.5} />
                Continuity Ops
              </button>
              <button
                onClick={() => setCurrentView('alerts')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  currentView === 'alerts'
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <AlertCircle size={16} className="inline mr-2" strokeWidth={1.5} />
                Alerts
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {currentView === 'dashboard' && <DashboardView onSelectAgent={handleSelectAgent} />}
        {currentView === 'detail' && selectedAgent && (
          <AgentDetailView agentId={selectedAgent} onBack={handleBack} />
        )}
        {currentView === 'ops' && <ContinuityOpsView />}
        {currentView === 'alerts' && <AlertsView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-gray-600">
          <p>Sheriff Agent Command Center • Last updated {new Date().toLocaleDateString()}</p>
        </div>
      </footer>
    </div>
  );
}
