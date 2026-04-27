import { useEffect, useCallback, useRef } from 'react'
import { api } from '../services/api.js'

export function useSSE(onNewCast) {
  const onNewCastRef = useRef(onNewCast)

  // keep ref up to date without triggering reconnect
  useEffect(() => {
    onNewCastRef.current = onNewCast
  }, [onNewCast])

  const connect = useCallback(() => {
    const eventSource = new EventSource(api.getSSEUrl())

    eventSource.onopen = () => {
      console.log('✅ SSE connected')
    }

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'connected') return
      onNewCastRef.current(data) // ← use ref, not closure
    }

    eventSource.onerror = (error) => {
      console.error('❌ SSE error:', error)
      eventSource.close()
      setTimeout(connect, 3000)
    }

    return eventSource
  }, []) // ← no deps, connect never recreates

  useEffect(() => {
    const eventSource = connect()
    return () => {
      console.log('🔌 SSE disconnected')
      eventSource?.close()
    }
  }, [connect])
}