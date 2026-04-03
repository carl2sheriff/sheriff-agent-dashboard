const AGENTS = {
  'repartition-ca-marge': {
    id: 'repartition-ca-marge',
    name: 'Agent Répartition CA/Marge',
    url: 'https://agent-repartition-ca-marge-production.up.railway.app',
    schedule: '0 8 * * *',
    scheduleHuman: 'Tous les jours à 8h00',
    description: 'Calcule et envoie la répartition CA/Marge via Slack et Google Sheets',
    integrations: ['Slack', 'Google Sheets'],
    slackChannel: '#finance',
    slackCommands: [],
    railwayServiceId: null,
    owner: 'Sheriff Projects',
    environmentVars: ['SLACK_BOT_TOKEN', 'SLACK_CHANNEL_ID', 'GOOGLE_SHEETS_ID', 'GOOGLE_SERVICE_ACCOUNT_KEY'],
  },
  'scouting-talent': {
    id: 'scouting-talent',
    name: 'Agent Scouting Talent',
    url: 'https://agent-scouting-talent-production.up.railway.app',
    schedule: '0 */24 * * *',
    scheduleHuman: 'Toutes les 24 heures',
    description: 'Scout et identifie les talents via Slack et Google Drive',
    integrations: ['Slack', 'Google Drive'],
    slackChannel: '#talent-scouting',
    slackCommands: ['/scouting-run', '/scouting-status'],
    railwayServiceId: null,
    owner: 'Sheriff Projects',
    environmentVars: ['SLACK_BOT_TOKEN', 'SLACK_CHANNEL_ID', 'GOOGLE_DRIVE_FOLDER_ID', 'GOOGLE_SERVICE_ACCOUNT_KEY', 'OPENAI_API_KEY'],
  },
}

module.exports = { AGENTS }
