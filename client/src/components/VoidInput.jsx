import { useState } from 'react'
import { api } from '../services/api.js'

export function VoidInput() {
  const [text, setText] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handleSubmit = async () => {
    if (!text.trim()) return

    setStatus('loading')
    try {
      await api.createCast(text.trim())
      setText('')
      setStatus('success')
      setTimeout(() => setStatus('idle'), 2000)
    } catch (err) {
      console.error(err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '0.75rem',
      zIndex: 10,
    }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="whisper into the void..."
        maxLength={100}
        disabled={status === 'loading'}
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '8px',
          color: '#fff',
          padding: '0.75rem 1.25rem',
          fontSize: '1rem',
          width: '320px',
          outline: 'none',
          backdropFilter: 'blur(10px)',
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={status === 'loading' || !text.trim()}
        style={{
          background: status === 'success'
            ? 'rgba(100,255,150,0.15)'
            : status === 'error'
            ? 'rgba(255,100,100,0.15)'
            : 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '8px',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          cursor: status === 'loading' ? 'wait' : 'pointer',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          whiteSpace: 'nowrap',
        }}
      >
        {status === 'loading' && '...'}
        {status === 'success' && '✓ cast'}
        {status === 'error' && '✗ failed'}
        {status === 'idle' && 'push to void'}
      </button>
    </div>
  )
}