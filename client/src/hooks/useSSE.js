import { useEffect, useCallback, useRef } from 'react'
import { api } from '../services/api.js'


const IDLE_TIMEOUT = parseInt(import.meta.env.VITE_IDLE_TIMEOUT)

export function useSSE(onNewCast) {
  const onNewCastRef = useRef(onNewCast)
  const eventSourceRef = useRef(null)
  const reconnectTimer = useRef(null)

  useEffect(() => {
    onNewCastRef.current = onNewCast
  }, [onNewCast])


  const idleTimer = useRef(null)

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
          onNewCastRef.current({ ...data, isNew: true })
        }
      } catch (err) {
        console.error('Failed to parse SSE message:', err)
      }
    }

    eventSource.onerror = () => {
      disconnect()
      if (!document.hidden) {
        console.log('Reconnecting SSE in 3 seconds...')
        reconnectTimer.current = setTimeout(connect, 3000)
      }
    }
  }, [disconnect])

  const resetIdleTimer = useCallback(() => {
  clearTimeout(idleTimer.current)
  if (eventSourceRef.current === null && !document.hidden) {
    connect()
  }
  idleTimer.current = setTimeout(() => {
    disconnect()
    console.log('🔌 SSE closed (idle)')
  }, IDLE_TIMEOUT)
}, [connect, disconnect])

useEffect(() => {
  const events = ['mousemove', 'mousedown', 'keydown', 'touchstart']
  events.forEach(e => window.addEventListener(e, resetIdleTimer))
  resetIdleTimer()
  return () => {
    events.forEach(e => window.removeEventListener(e, resetIdleTimer))
    clearTimeout(idleTimer.current)
  }
}, [resetIdleTimer])


  useEffect(() => {
    connect()

    const handleVisibilityChange = () => {
      if (document.hidden) {
        disconnect()
        console.log('🔌 SSE closed (tab hidden)')
      } else {
        connect()
        console.log('✅ SSE reconnected (tab visible)')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      disconnect()
    }
  }, [connect, disconnect])
}