import { useEffect, useCallback, useRef } from 'react'
import { api } from '../services/api.js'

const IDLE_TIMEOUT = parseInt(import.meta.env.VITE_IDLE_TIMEOUT)

export function useSSE(onNewCast) {
  const onNewCastRef = useRef(onNewCast)
  const lastSeenAtRef = useRef(null)
  const eventSourceRef = useRef(null)
  const reconnectTimer = useRef(null)
  const idleTimer = useRef(null)
  const connectRef = useRef(null)
  const isIdleDisconnectRef = useRef(false)


  const fetchMissed = useCallback(async () => {
    try {
      const all = await api.getCasts()
      const missed = lastSeenAtRef.current 
        ? all.filter(c => new Date(c.createdAt) > new Date(lastSeenAtRef.current))
  : all
      missed.forEach(c => onNewCastRef.current({ ...c, isNew: false }))
      if (missed.length > 0) lastSeenAtRef.current = missed[0].createdAt
    } catch (err) {
      console.error('Failed to fetch missed casts:', err)
    }
  }, [])
  
  const disconnect = useCallback(() => {
    clearTimeout(reconnectTimer.current)
    eventSourceRef.current?.close()
    eventSourceRef.current = null
  }, [])

  const connect = useCallback(() => {
    disconnect()
    if (document.hidden) return

    const eventSource = new EventSource(api.getSSEUrl())
    eventSourceRef.current = eventSource

    eventSource.onopen = () => console.log('✅ SSE connected')

    eventSource.onmessage = (event) => {
      try {
        if (!event.data || event.data.trim() === '') return
        const data = JSON.parse(event.data)
        if (data.type === 'connected') return
        if (data.id && data.text) {
          lastSeenAtRef.current = data.createdAt
          onNewCastRef.current({ ...data, isNew: true })
        }
      } catch (err) {
        console.error('Failed to parse SSE message:', err)
      }
    }

eventSource.onerror = () => {
  disconnect()
  if (!document.hidden) {
    console.log('⏳ Reconnecting SSE in 3 seconds...')
    reconnectTimer.current = setTimeout(() => {
      connectRef.current?.()
      fetchMissed()
    }, 3000)
  }
}
  }, [disconnect, fetchMissed])

  const resetIdleTimer = useCallback(() => {
    clearTimeout(idleTimer.current)

    // If we're reconnecting from idle, ensure we connect
    if (eventSourceRef.current === null && !document.hidden) {
      console.log('🔄 Resuming from idle, reconnecting...')
      connect()
      fetchMissed() // Fetch any missed messages while idle
    }

    // Set new idle timer
    idleTimer.current = setTimeout(() => {
      if (eventSourceRef.current) {
        isIdleDisconnectRef.current = true
        disconnect()
        console.log('🔌 SSE closed (idle timeout)')
      }
    }, IDLE_TIMEOUT)
  }, [connect, disconnect, fetchMissed])

  /* -----------Effects-----------*/

  // On new casts
  useEffect(() => {
    onNewCastRef.current = onNewCast
  }, [onNewCast])


  // On user inactivity
  useEffect(() => {
    connectRef.current = connect

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click']
    
    const handleUserActivity = () => {
      resetIdleTimer()
    }
    
    events.forEach(e => window.addEventListener(e, handleUserActivity))
    resetIdleTimer()
    
    return () => {
      events.forEach(e => window.removeEventListener(e, handleUserActivity))
      clearTimeout(idleTimer.current)
    }
  }, [connect, resetIdleTimer])

  // On page invisibility
  useEffect(() => {
    connect()

    const handleVisibilityChange = () => {
      if (document.hidden) {
        disconnect()
        console.log('🔌 SSE closed (tab hidden)')
      } else {
        resetIdleTimer()
        fetchMissed()
        console.log('✅ SSE reconnected (tab visible)')
      }
    }



    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      disconnect()
    }
  }, [connect, disconnect, resetIdleTimer, fetchMissed])
}