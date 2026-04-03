import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '../lib/api'

const POLL_INTERVAL = 30000 // 30 seconds

export function useAgentStatus(agentId, { autoRefresh = true } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)
  const mountedRef = useRef(true)

  const fetchStatus = useCallback(async () => {
    if (!agentId) return
    try {
      const result = await api.getAgentStatus(agentId)
      if (!mountedRef.current) return
      setData(result)
      setError(null)
    } catch (err) {
      if (!mountedRef.current) return
      setError(err.message)
      setData((prev) => ({
        ...prev,
        status: 'unknown',
        lastChecked: new Date().toISOString(),
        error: err.message,
      }))
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [agentId])

  useEffect(() => {
    mountedRef.current = true
    setLoading(true)
    fetchStatus()

    if (autoRefresh) {
      intervalRef.current = setInterval(fetchStatus, POLL_INTERVAL)
    }

    return () => {
      mountedRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [agentId, autoRefresh, fetchStatus])

  return {
    status: data?.status || 'unknown',
    responseTime: data?.responseTime ?? null,
    lastChecked: data?.lastChecked || null,
    httpStatus: data?.httpStatus || null,
    body: data?.body || null,
    error,
    loading,
    refresh: fetchStatus,
  }
}
