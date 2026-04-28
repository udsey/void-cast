import { useState } from 'react'
import { api } from '../services/api.js'
import { buttonStyle } from '../styles/buttons.js'

const MAX_LINE_LENGTH = parseInt(import.meta.env.VITE_MAX_LINE_LENGTH)
const MAX_LINES = parseInt(import.meta.env.VITE_MAX_LINES)
const INPUT_PLACEHOLDER = import.meta.env.VITE_INPUT_PLACEHOLDER
const BUTTON_TEXT = import.meta.env.VITE_BUTTON_TEXT
const BUTTON_TEXT_OVER_LIMIT = import.meta.env.VITE_BUTTON_TEXT_OVER_LIMIT 

const splitIntoLines = (text) => {
  // first break any word longer than MAX_LINE_LENGTH
  const normalized = text.trim().replace(/\S+/g, (word) => {
    if (word.length <= MAX_LINE_LENGTH) return word
    // chunk it into MAX_LINE_LENGTH pieces
    return word.match(new RegExp(`.{1,${MAX_LINE_LENGTH}}`, 'g')).join(' ')
  })

  const words = normalized.split(' ')
  const lines = []
  let current = ''

  for (const word of words) {
    if (current.length + word.length + 1 <= MAX_LINE_LENGTH) {
      current = current ? `${current} ${word}` : word
    } else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

export function VoidInput({ currentViewPosition }) {  // ← ADD this prop
  const [text, setText] = useState('')
  const [status, setStatus] = useState('idle')

  const lines = splitIntoLines(text)
  const isOverLimit = lines.length > MAX_LINES
  const lineCount = Math.min(lines.length, MAX_LINES + 1)

  const handleSubmit = async () => {
    if (!text.trim() || isOverLimit) return

    setStatus('loading')
    try {
      console.log('Submitting cast:', text.trim())
      console.log('Current view position:', currentViewPosition)  // ← Log position
      
      // Pass the current view position to API
      const result = await api.createCast(text.trim(), currentViewPosition)
      
      console.log('Cast created successfully at:', result.x, result.y)
      
      setText('')
      setStatus('success')
      setTimeout(() => setStatus('idle'), 2000)
    } catch (err) {
      console.error('Failed to create cast - Full error:', err)
      console.error('Error message:', err.message)
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
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      zIndex: 10,
    }}>

      {/* line indicator */}
      <div style={{
        display: 'flex',
        gap: '4px',
        alignSelf: 'flex-start',
        paddingLeft: '2px',
      }}>
        {Array.from({ length: MAX_LINES }).map((_, i) => (
          <div
            key={i}
            style={{
              width: '24px',
              height: '3px',
              borderRadius: '2px',
              background: i < lineCount
                ? isOverLimit ? '#ff6b6b' : 'rgba(255,255,255,0.7)'
                : 'rgba(255,255,255,0.15)',
              transition: 'background 0.2s ease',
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={INPUT_PLACEHOLDER}
          disabled={status === 'loading'}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${isOverLimit ? 'rgba(255,100,100,0.6)' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: '8px',
            color: '#fff',
            padding: '0.75rem 1.25rem',
            fontSize: '1rem',
            width: '320px',
            outline: 'none',
            backdropFilter: 'blur(10px)',
            transition: 'border-color 0.2s ease',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={status === 'loading' || !text.trim() || isOverLimit}
          style={{
            ...buttonStyle,
          }}
        >
          {status === 'loading' && '...'}
          {status === 'success' && '✓ cast'}
          {status === 'error' && '✗ failed'}
          {status === 'idle' && (isOverLimit ? BUTTON_TEXT_OVER_LIMIT : BUTTON_TEXT)}
        </button>
      </div>

      {/* overflow warning */}
      {isOverLimit && (
        <p style={{
          color: 'rgba(255,100,100,0.8)',
          fontSize: '0.75rem',
          margin: 0,
        }}>
          max {MAX_LINES} lines of {MAX_LINE_LENGTH} chars each
        </p>
      )}
    </div>
  )
}