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
      try {
        // Skip empty messages
        if (!event.data || event.data.trim() === '') {
          console.warn('Empty SSE message received')
          return
        }
        
        console.log('Raw SSE data:', event.data)
        
        const data = JSON.parse(event.data)
        
        if (data.type === 'connected') {
          console.log('SSE handshake complete')
          return
        }
        
        // Handle new cast
        if (data.id && data.text) {
          console.log('New cast received via SSE:', data.id)
          onNewCastRef.current({ ...data, isNew: true })
        }
      } catch (err) {
        console.error('Failed to parse SSE message:', err)
        console.error('Raw data that failed:', event.data)
      }
    }

    eventSource.onerror = (error) => {
      console.error('❌ SSE error:', error)
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log('Reconnecting SSE in 3 seconds...')
        eventSource.close()
        setTimeout(connect, 3000)
      }
    }

    return eventSource
  }, [])

  useEffect(() => {
    const eventSource = connect()
    return () => {
      console.log('🔌 SSE disconnected')
      eventSource?.close()
    }
  }, [connect])
}