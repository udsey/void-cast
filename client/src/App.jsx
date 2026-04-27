import { useState, useEffect, useCallback } from 'react'
import { VoidCloud } from './components/VoidCloud.jsx'
import { VoidInput } from './components/VoidInput.jsx'
import { useSSE } from './hooks/useSSE.js'
import { api } from './services/api.js'
import { Nav } from './components/Nav.jsx'
import { encodePosition, decodePosition, generateRandomPosition, WORLD_BOUNDS } from './utils/coordinates.js'

export default function App() {
  const [casts, setCasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [initialPosition, setInitialPosition] = useState(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Handle coordinate parsing and redirection
  useEffect(() => {
    const path = window.location.pathname
    
    // Check if we're at /c/[encoded]
    const match = path.match(/^\/c\/([A-Za-z0-9]+)$/)
    
    if (match) {
      // Valid coordinate URL - decode it
      try {
        const pos = decodePosition(match[1])
        console.log('Decoded position from URL:', pos)
        // Validate bounds
        if (pos.x >= WORLD_BOUNDS.min && pos.x <= WORLD_BOUNDS.max &&
            pos.y >= WORLD_BOUNDS.min && pos.y <= WORLD_BOUNDS.max) {
          setInitialPosition(pos)
        } else {
          throw new Error(pos, 'Out of bounds')
        }
      } catch (err) {
        console.error('Invalid coordinates, redirecting to random...', err)
        redirectToRandomPosition()
      }
    } else if (path === '/' || path === '') {
      // Root path - generate random coordinates
      redirectToRandomPosition()
    } else {
      // Unknown path - redirect to random
      redirectToRandomPosition()
    }
  }, [])

  const redirectToRandomPosition = useCallback(() => {
    if (isRedirecting) return
    setIsRedirecting(true)
    
    const pos = generateRandomPosition(WORLD_BOUNDS.min, WORLD_BOUNDS.max)
    const encoded = encodePosition(pos.x, pos.y)
    window.location.href = `/c/${encoded}`
  }, [isRedirecting])

  // Only fetch casts after we have position or if redirecting
  useEffect(() => {
    if (isRedirecting) return
    if (!initialPosition && window.location.pathname !== '/') return
    
    const fetchCasts = async () => {
      try {
        const data = await api.getCasts()
        setCasts(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load the void...')
      } finally {
        setLoading(false)
      }
    }

    fetchCasts()
  }, [initialPosition, isRedirecting])

  const handleNewCast = useCallback((newCast) => {
    setCasts((prev) => {
      if (prev.find((c) => c.id === newCast.id)) return prev
      return [{ ...newCast, isNew: true }, ...prev]
    })
  }, [])
  
  useSSE(handleNewCast)

  // Show loading while determining position or redirecting
  if (isRedirecting) {
    return (
      <div style={centerStyle}>
        <p style={{ color: 'rgba(255,255,255,0.3)' }}>finding your place in the void...</p>
      </div>
    )
  }

  if (!initialPosition && !isRedirecting) {
    return (
      <div style={centerStyle}>
        <p style={{ color: 'rgba(255,255,255,0.3)' }}>opening the void...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={centerStyle}>
        <p style={{ color: 'rgba(255,255,255,0.3)' }}>opening the void...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={centerStyle}>
        <p style={{ color: 'rgba(255,100,100,0.6)' }}>{error}</p>
      </div>
    )
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0a0a0a', position: 'relative' }}>
      <VoidCloud casts={casts} initialPosition={initialPosition} />
      <Nav />
      <div style={{ position: 'relative', zIndex: 100, pointerEvents: 'auto' }}>
        <VoidInput />
      </div>
    </div>
  )
}

const centerStyle = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#0a0a0a',
}