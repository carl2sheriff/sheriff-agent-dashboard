# Fiches Agents — Sheriff Projects

## Agent Répartition CA/Marge

### Identité

| Champ | Valeur |
|-------|--------|
| ID | `repartition-ca-marge` |
| Nom | Agent Répartition CA/Marge |
| Propriétaire | Sheriff Projects |
| URL | `https://agent-repartition-ca-marge-production.up.railway.app` |
| Plateforme | Railway (balanced-abundance) |

### Rôle

Calcule et envoie la répartition CA/Marge via Slack et Google Sheets. Génère un rapport quotidien avec la ventilation du chiffre d'affaires et des marges par catégorie, envoyé dans le canal Slack `#finance` et mis à jour dans Google Sheets.

### Schedule

```
Cron:   0 8 * * *
Humain: Tous les jours à 8h00
```

### Inputs

- Données CA/Marge depuis Google Sheets (lecture)
- Variables d'environnement de configuration

### Outputs

- Message Slack dans `#finance` avec tableau de bord
- Mise à jour Google Sheets (écriture)

### Intégrations

| Service | Usage | Variable |
|---------|-------|----------|
| Slack | Envoi rapport quotidien | `SLACK_BOT_TOKEN`, `SLACK_CHANNEL_ID` |
| Google Sheets | Lecture données + écriture résultats | `GOOGLE_SHEETS_ID`, `GOOGLE_SERVICE_ACCOUNT_KEY` |

### Variables d'environnement requises

| Variable | Description |
|----------|-------------|
| `SLACK_BOT_TOKEN` | Token bot Slack (xoxb-...) |
| `SLACK_CHANNEL_ID` | ID du channel #finance |
| `GOOGLE_SHEETS_ID` | ID du Google Sheet de données |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | JSON clé service account Google |

### Endpoints exposés

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/status` | Retourne l'état de l'agent |

### Commandes Slack

Aucune commande slash directe.

### Problèmes connus

- Peut être lent si Google Sheets est grand (> 1000 lignes) — timeout possible à 30s
- Le token Slack expire tous les 90 jours — prévoir rotation
- Les quotas Google Sheets API sont limités à 300 requêtes/min/projet

---

## Agent Scouting Talent

### Identité

| Champ | Valeur |
|-------|--------|
| ID | `scouting-talent` |
| Nom | Agent Scouting Talent |
| Propriétaire | Sheriff Projects |
| URL | `https://agent-scouting-talent-production.up.railway.app` |
| Plateforme | Railway (balanced-abundance) |

### Rôle

Scout et identifie les talents via Slack et Google Drive. Analyse les profils candidats stockés dans Google Drive, effectue un scoring, et publie un rapport dans le canal Slack `#talent-scouting`. Peut être déclenché manuellement via des commandes Slack.

### Schedule

```
Cron:   0 */24 * * *
Humain: Toutes les 24 heures
```

### Inputs

- Profils candidats depuis Google Drive (lecture)
- Commandes manuelles via Slack slash commands
- Variables d'environnement de configuration

### Outputs

- Message Slack dans `#talent-scouting` avec rapport de scouting
- Fichiers résultats exportés vers Google Drive

### Intégrations

| Service | Usage | Variable |
|---------|-------|----------|
| Slack | Rapport + réception commandes | `SLACK_BOT_TOKEN`, `SLACK_CHANNEL_ID` |
| Google Drive | Lecture profils + écriture résultats | `GOOGLE_DRIVE_FOLDER_ID`, `GOOGLE_SERVICE_ACCOUNT_KEY` |
| OpenAI | Scoring et analyse profils | `OPENAI_API_KEY` |

### Variables d'environnement requises

| Variable | Description |
|----------|-------------|
| `SLACK_BOT_TOKEN` | Token bot Slack (xoxb-...) |
| `SLACK_CHANNEL_ID` | ID du channel #talent-scouting |
| `GOOGLE_DRIVE_FOLDER_ID` | ID du dossier Google Drive profils |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | JSON clé service account Google |
| `OPENAI_API_KEY` | Clé API OpenAI pour analyse |

### Endpoints exposés

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/status` | Retourne l'état de l'agent |
| POST | `/slack/commands` | Réception des commandes slash Slack |

### Commandes Slack

| Commande | Description | Usage |
|----------|-------------|-------|
| `/scouting-run` | Déclenche un scouting immédiat | `/scouting-run` |
| `/scouting-status` | Affiche le statut et la dernière exécution | `/scouting-status` |

### Format payload `/slack/commands`

```json
{
  "command": "/scouting-run",
  "text": "",
  "user_name": "carl"
}
```

### Problèmes connus

- L'analyse OpenAI peut prendre 20-30s pour de nombreux profils
- Les quotas Google Drive API peuvent être atteints si le dossier est volumineux
- Les slash commands Slack nécessitent une URL publique (Railway fournit ça automatiquement)
- Vérifier que l'app Slack a le scope `commands` activé
