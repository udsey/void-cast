import { useState, useEffect, useCallback } from 'react'
import { VoidCloud } from './components/VoidCloud.jsx'
import { VoidInput } from './components/VoidInput.jsx'
import { useSSE } from './hooks/useSSE.js'
import { api } from './services/api.js'
import { Nav } from './components/Nav.jsx'

export default function App() {
  const [casts, setCasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
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
  }, [])

  const handleNewCast = useCallback((newCast) => {
    setCasts((prev) => {
      if (prev.find((c) => c.id === newCast.id)) return prev
      return [{ ...newCast, isNew: true }, ...prev]
    })
  }, [])
  
  useSSE(handleNewCast)

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
      <VoidCloud casts={casts} />
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