import { useState, useEffect, useCallback } from 'react'
import { VoidCloud } from './components/VoidCloud.jsx'
import { VoidInput } from './components/VoidInput.jsx'
import { useSSE } from './hooks/useSSE.js'
import { api } from './services/api.js'
import { Nav } from './components/Nav.jsx'
import { encodePosition, decodePosition, generateRandomPosition, isValidPosition } from './utils/coordinates.js'
import { screenStyle } from './styles/screen.js'

export default function App() {
  const [casts, setCasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [initialPosition, setInitialPosition] = useState(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [currentViewPosition, setCurrentViewPosition] = useState({ x: 0, y: 0 })

  const redirectToRandomPosition = useCallback(() => {
  if (isRedirecting) return
  setIsRedirecting(true)
  
  const pos = generateRandomPosition()
  const encoded = encodePosition(pos.x, pos.y)
  window.location.href = `${encoded}`
}, [isRedirecting])

  // Handle coordinate parsing and redirection
  useEffect(() => {
    const path = window.location.pathname

    console.log('pathname:', path)
    console.log('match:', path.match(/^\/([A-Za-z0-9-]+)$/))
  
    
    // Check if we're at /[encoded]
    const match = path.match(/^\/([A-Za-z0-9-]+)$/)
    
    if (match) {
      try {
        const pos = decodePosition(match[1])
        if (isValidPosition(pos.x, pos.y)) {
          setTimeout(() => setInitialPosition(pos), 0)
        } else {
          console.error('Decoded coordinates are out of bounds, redirecting to random...', pos)
          setTimeout(() => redirectToRandomPosition(), 0)
        }
        
      } catch (err) {
        console.error('Invalid coordinates, redirecting to random...', err)
        setTimeout(() => redirectToRandomPosition(), 0)
      }
    } else if (path === '/' || path === '') {
      // Root path - set initial position to center (0,0)
      setTimeout(() => setInitialPosition({ x: 0, y: 0 }), 0)
    } else {
      // Unknown path - redirect to random
      setTimeout(() => redirectToRandomPosition(), 0)
    }
  }, [redirectToRandomPosition])



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
      return [{ ...newCast }, ...prev]
    })
  }, [])
  
  useSSE(handleNewCast)

  // Show loading while determining position or redirecting
  if (isRedirecting) {
    return (
      <div style={screenStyle}>
        <p style={{ color: 'rgba(255,255,255,0.3)' }}>finding your place in the void...</p>
      </div>
    )
  }

  if (!initialPosition && !isRedirecting) {
    return (
      <div style={screenStyle}>
        <p style={{ color: 'rgba(255,255,255,0.3)' }}>opening the void...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={screenStyle}>
        <p style={{ color: 'rgba(255,255,255,0.3)' }}>opening the void...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={screenStyle}>
        <p style={{ color: 'rgba(255,100,100,0.6)' }}>{error}</p>
      </div>
    )
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0a0a0a', position: 'relative' }}>
      <VoidCloud 
        casts={casts} 
        initialPosition={initialPosition}
        onViewChange={setCurrentViewPosition}  // ← PASS THIS
      />
      <Nav />
      <div style={{zIndex: 100, pointerEvents: 'auto' }}>
        <VoidInput currentViewPosition={currentViewPosition} />
      </div>
    </div>
  )
}