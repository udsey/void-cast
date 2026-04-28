import { useEffect, useState, useRef } from 'react'
import { api } from '../services/api.js'
import { getButtonStyle } from '../styles/buttons.js'
import { Check, Forward, Loader, X, Ban } from 'lucide-react'
import { Shuffle, Link } from 'lucide-react'
import { encodePosition, generateRandomPosition } from '../utils/coordinates.js'


const VITE_MAX_LINE_LENGTH = parseInt(import.meta.env.VITE_MAX_LINE_LENGTH)
const VITE_MAX_LINES = parseInt(import.meta.env.VITE_MAX_LINES)
const INPUT_PLACEHOLDER = import.meta.env.VITE_INPUT_PLACEHOLDER

console.log('Loaded config - Max line length:', VITE_MAX_LINE_LENGTH, 'Max lines:', VITE_MAX_LINES)

const splitIntoLines = (text) => {
  // first break any word longer than VITE_MAX_LINE_LENGTH
  const normalized = text.trim().replace(/\S+/g, (word) => {
    if (word.length <= VITE_MAX_LINE_LENGTH) return word
    // chunk it into VITE_MAX_LINE_LENGTH pieces
    return word.match(new RegExp(`.{1,${VITE_MAX_LINE_LENGTH}}`, 'g')).join(' ')
  })

  const words = normalized.split(' ')
  const lines = []
  let current = ''

  for (const word of words) {
    if (current.length + word.length + 1 <= VITE_MAX_LINE_LENGTH) {
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
  const isOverLimit = lines.length > VITE_MAX_LINES
  const lineCount = Math.min(lines.length, VITE_MAX_LINES + 1)

  const [copied, setCopied] = useState(false)
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024)


  const buttonStyle = getButtonStyle(isMobile, isTablet)

  const [rateLimited, setRateLimited] = useState(false)

  const inputRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 375)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])



  const handleExplore = () => {

    const pos = generateRandomPosition()
    const encoded = encodePosition(pos.x, pos.y)

    document.body.classList.add('fade-out')

    setTimeout(() => {
      window.location.href = `/${encoded}`
    }, 300)
  }

  const handleShare = async () => {
    const { x, y } = currentViewPosition
    const encoded = encodePosition(x, y)
    const url = `${window.location.origin}/${encoded}`
    await navigator.clipboard.writeText(url)
    window.history.replaceState(null, '', `/${encoded}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
      setTimeout(() => inputRef.current?.focus(), 0)
      setStatus('success')
      setTimeout(() => setStatus('idle'), 2000)
    } catch (err) {
      if (err.status === 429) {
        setStatus('error')
        setRateLimited(true)
        setTimeout(() => {
          setStatus('idle')
          setRateLimited(false)
        }, 5000) // reset after 1 minute
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 2000)
      }
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
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
      {/* Explore button */}
      <button onClick={handleExplore} style={buttonStyle}><Shuffle size={18} /></button>
      {/* Share button */}
      <button onClick={handleShare} style={buttonStyle}>{copied ? <Check size={18} /> : <Link size={18} />}</button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'flex-end' }}>
        {/* Line indicator */}
        <div style={{ display: 'flex', gap: '4px', paddingLeft: '2px' }}>
          {Array.from({ length: VITE_MAX_LINES }).map((_, i) => (
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

        {/* Input + submit row */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <input ref={inputRef}
            autoFocus
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
              padding: '0 1.25rem',
              fontSize: '1rem',
              height: '52px',
              width: isMobile ? '160px' : isTablet ? '240px' : '320px',
              outline: 'none',
              backdropFilter: 'blur(10px)',
              transition: 'border-color 0.2s ease',
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={status === 'loading' || !text.trim() || isOverLimit}
            style={{ ...buttonStyle }}
          >
            {status === 'loading' && <Loader size={18} />}
            {status === 'success' && <Check size={18} />}
            {status === 'error' && <X size={18} />}
            {status === 'idle' && (isOverLimit ? <Ban size={18} /> : <Forward size={18} />)}
          </button>
        </div>
      </div>
    </div>

    {/* Overflow warning */}
    {isOverLimit && (
      <p style={{ color: 'rgba(255,100,100,0.8)', fontSize: '0.75rem', margin: 0 }}>
        max {VITE_MAX_LINES} lines of {VITE_MAX_LINE_LENGTH} chars each
      </p>
    )}
    {/* Rate limit warning */}
    {rateLimited && (
      <p style={{ color: 'rgba(255,100,100,0.8)', fontSize: '0.75rem', margin: 0 }}>
        too many casts. take a moment to enjoy the void.
      </p>
    )}
  </div>
)
}