import { useState } from 'react'
import { AboutModal } from './AboutModal.jsx'

const NAV_POSITION = import.meta.env.VITE_NAV_POSITION
const GITHUB_URL = import.meta.env.VITE_GITHUB_URL

const positions = {
  'top-left': { top: '1.5rem', left: '1.5rem' },
  'top-right': { top: '1.5rem', right: '1.5rem' },
  'bottom-left': { bottom: '1.5rem', left: '1.5rem' },
  'bottom-right': { bottom: '1.5rem', right: '1.5rem' },
}

const linkStyle = {
  background: 'none',
  border: 'none',
  color: 'rgba(255,255,255,0.35)',
  fontSize: '0.8rem',
  cursor: 'pointer',
  padding: 0,
  fontFamily: 'inherit',
  letterSpacing: '0.05em',
  transition: 'color 0.2s ease',
  textDecoration: 'none',
}

export function Nav() {
  const [aboutOpen, setAboutOpen] = useState(false)

  const navStyle = {
    position: 'fixed',
    zIndex: 20,
    display: 'flex',
    gap: '1.5rem',
    ...positions[NAV_POSITION],
  }

  return (
    <div>
      <nav style={navStyle}>
        <button onClick={() => setAboutOpen(true)} style={linkStyle}>
          about
        </button>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>
          github
        </a>
      </nav>
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  )
}