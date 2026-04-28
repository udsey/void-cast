import { useEffect, useCallback, useRef } from 'react'
import { api } from '../services/api.js'

export function useSSE(onNewCast) {
  const onNewCastRef = useRef(onNewCast)
  const eventSourceRef = useRef(null)
  const reconnectTimer = useRef(null)

  useEffect(() => {
    onNewCastRef.current = onNewCast
  }, [onNewCast])

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