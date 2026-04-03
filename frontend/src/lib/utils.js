// Format a timestamp as relative time
export function timeAgo(isoString) {
  if (!isoString) return 'Jamais'
  const now = Date.now()
  const past = new Date(isoString).getTime()
  const diff = Math.floor((now - past) / 1000)

  if (diff < 60) return `Il y a ${diff}s`
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)}min`
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`
  if (diff < 86400 * 7) return `Il y a ${Math.floor(diff / 86400)}j`
  return new Date(isoString).toLocaleDateString('fr-FR')
}

// Format duration in ms to human readable
export function formatDuration(ms) {
  if (!ms) return '-'
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.floor(ms / 60000)}min ${Math.floor((ms % 60000) / 1000)}s`
}

// Format response time
export function formatResponseTime(ms) {
  if (ms === null || ms === undefined) return '-'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

// Parse cron expression to next run date
export function getNextRunFromCron(cronExpression) {
  try {
    // Parse basic cron patterns
    const parts = cronExpression.split(' ')
    if (parts.length !== 5) return null

    const [minute, hour, dom, month, dow] = parts
    const now = new Date()
    const next = new Date(now)

    // Handle "0 8 * * *" — daily at 8am
    if (dow === '*' && dom === '*' && month === '*') {
      const targetHour = parseInt(hour)
      const targetMinute = parseInt(minute)

      if (!isNaN(targetHour) && !isNaN(targetMinute)) {
        next.setHours(targetHour, targetMinute, 0, 0)
        if (next <= now) {
          next.setDate(next.getDate() + 1)
        }
        return next.toISOString()
      }

      // Handle "0 */24 * * *" — every 24h
      if (hour.startsWith('*/')) {
        const interval = parseInt(hour.slice(2))
        next.setMinutes(parseInt(minute), 0, 0)
        while (next <= now) {
          next.setHours(next.getHours() + interval)
        }
        return next.toISOString()
      }
    }

    return null
  } catch {
    return null
  }
}

// Human-readable cron (simplified)
export function cronToHuman(cron) {
  const map = {
    '0 8 * * *': 'Tous les jours à 8h00',
    '0 */24 * * *': 'Toutes les 24 heures',
    '0 0 * * *': 'Tous les jours à minuit',
    '0 9 * * 1-5': 'Du lundi au vendredi à 9h00',
    '*/5 * * * *': 'Toutes les 5 minutes',
  }
  return map[cron] || cron
}

// Format date to locale string
export function formatDate(isoString) {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Status to color map
export function statusColor(status) {
  const map = {
    healthy: 'text-[#22c55e]',
    degraded: 'text-[#f59e0b]',
    down: 'text-[#ef4444]',
    unknown: 'text-[#6b6b6b]',
    success: 'text-[#22c55e]',
    failed: 'text-[#ef4444]',
    warning: 'text-[#f59e0b]',
    info: 'text-[#3b82f6]',
    error: 'text-[#ef4444]',
  }
  return map[status] || 'text-[#6b6b6b]'
}

// Status dot color
export function statusDotColor(status) {
  const map = {
    healthy: 'bg-[#22c55e]',
    degraded: 'bg-[#f59e0b]',
    down: 'bg-[#ef4444]',
    unknown: 'bg-[#6b6b6b]',
    success: 'bg-[#22c55e]',
    failed: 'bg-[#ef4444]',
    warning: 'bg-[#f59e0b]',
    info: 'bg-[#3b82f6]',
    error: 'bg-[#ef4444]',
  }
  return map[status] || 'bg-[#6b6b6b]'
}

// Clamp a number between min and max
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}
