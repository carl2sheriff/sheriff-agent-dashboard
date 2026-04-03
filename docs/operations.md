# Runbook Opérationnel — Sheriff Agent Dashboard

## Démarrage des agents

### Démarrer un agent (Railway)

1. Aller sur [Railway Dashboard](https://railway.app/project/63830b39-2415-4c9e-ba52-79a6053a8dab)
2. Sélectionner le service correspondant
3. Cliquer sur "Deploy" ou vérifier que le déploiement est actif
4. Attendre que le statut passe à "ACTIVE"
5. Vérifier via Sheriff Dashboard → page agent → "Statut en temps réel"

### Arrêter un agent (Railway)

1. Aller sur Railway Dashboard → service cible
2. Aller dans Settings → Danger Zone → "Remove service" ou suspendre le déploiement
3. Confirmer que `/status` retourne une erreur (agent arrêté)

### Redémarrer un agent

**Via Sheriff Dashboard (recommandé) :**
1. Naviguer vers la page de l'agent
2. Cliquer "Redémarrer" dans le panel Actions
3. Confirmer dans la modale
4. Vérifier le retour en ligne dans les 60s

**Via Railway :**
1. Railway Dashboard → service → Deployments
2. Cliquer "Redeploy" sur le dernier déploiement
3. Attendre que le statut passe à "SUCCESS"

## Diagnostic

### Agent "Hors ligne" (DOWN)

```
1. Vérifier la connectivité réseau générale
2. Ouvrir Railway Dashboard → vérifier le statut du service
3. Consulter les logs Railway (onglet "Logs")
4. Vérifier les variables d'environnement (onglet "Variables")
5. Redéployer si les logs montrent une erreur de démarrage
6. Si le problème persiste → vérifier les dépendances externes (Slack, Google)
```

### Agent "Dégradé" (DEGRADED)

```
1. Vérifier le temps de réponse (Sheriff Dashboard → page agent)
2. Si > 8s : l'API externe (Slack/Google) est probablement lente
3. Consulter les logs pour identifier l'opération lente
4. Si délai consécutifs : redémarrer l'agent
```

### Agent "Inconnu" (UNKNOWN)

```
1. Vérifier que le backend Sheriff est accessible (:3001/health)
2. Vérifier la connectivité réseau entre backend et agent
3. Rafraîchir manuellement (bouton "Actualiser")
4. Vérifier les logs du backend pour des erreurs de proxy
```

## Procédures d'urgence

### Échec d'intégration Slack

**Symptômes :** Agent actif mais pas de messages dans le channel

```
1. Vérifier que SLACK_BOT_TOKEN est valide
   → https://api.slack.com/apps → votre app → OAuth tokens
2. Vérifier que le bot est membre du channel
3. Tester la commande slash (agent scouting) pour vérifier Slack
4. Si token expiré : régénérer et mettre à jour sur Railway Variables
5. Redémarrer l'agent après mise à jour
```

### Accès Google révoqué

**Symptômes :** Logs montrent "403 Forbidden" ou "401 Unauthorized"

```
1. Aller sur Google Cloud Console → IAM & Admin → Service Accounts
2. Trouver le service account de l'agent
3. Vérifier que le compte est actif et a les permissions
4. Re-partager le fichier/dossier avec l'email du service account
5. Si la clé a expiré : créer une nouvelle clé JSON
6. Mettre à jour GOOGLE_SERVICE_ACCOUNT_KEY sur Railway
7. Redémarrer l'agent
```

### Dépassement de quota API

**Symptômes :** Erreur "429 Too Many Requests"

```
1. Identifier quelle API est saturée (Slack, Google, OpenAI)
2. Attendre le reset du quota (généralement 1h pour Google, 24h pour OpenAI)
3. Si récurrent : réduire la fréquence du schedule
4. Pour OpenAI : vérifier les limites de taux sur platform.openai.com
```

## Checklist de monitoring quotidien

Effectuer chaque matin (après 8h30) :

- [ ] Vérifier que les 2 agents sont "Actif" (vert) sur Sheriff Dashboard
- [ ] Confirmer la présence du rapport CA/Marge dans `#finance` Slack
- [ ] Confirmer la présence du rapport scouting dans `#talent-scouting` Slack
- [ ] Vérifier absence d'alertes non résolues dans la page Alertes
- [ ] Contrôler les temps de réponse (idéal < 2s, alerte > 8s)
- [ ] Parcourir rapidement les logs pour erreurs récurrentes

## Contacts et escalade

| Niveau | Contact | Canal |
|--------|---------|-------|
| L1 — Monitoring | Sheriff Dashboard auto-alert | Slack #alerts |
| L2 — Investigation | Sheriff Projects | Slack #ops-internal |
| L3 — Infrastructure | Railway Support | support.railway.app |
| L4 — Intégrations | Google / Slack / OpenAI support | Portails respectifs |

## Maintenance préventive

### Mensuelle

- Vérifier l'expiration des tokens Slack (90 jours)
- Vérifier les clés Google Service Account
- Contrôler les quotas API (Google, OpenAI)
- Mettre à jour les dépendances Node.js si vulnérabilités

### Trimestrielle

- Revoir les seuils d'alerte (réponse, inactivité)
- Vérifier les logs Railway pour patterns d'erreurs
- Tester les procédures de restart
- Documenter les nouveaux endpoints ou changements d'agents
