import { useState } from 'react'
import { AboutModal } from './AboutModal.jsx'
import { navStyle } from '../styles/containers.js'
import { linkStyle } from '../styles/link.js'
import { SupportModal } from './SupportModal.jsx'


const GITHUB_URL = import.meta.env.VITE_GITHUB_URL




export function Nav() {
  const [aboutOpen, setAboutOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)

  return (
    <div>
      <nav style={navStyle}>
        <button onClick={() => setAboutOpen(true)} style={linkStyle}>
          about
        </button>
        <button onClick={() => setSupportOpen(true)} style={linkStyle}>
          support
        </button>
      </nav>
      <SupportModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  )
}