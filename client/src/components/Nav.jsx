import { useState } from 'react'

import { navStyle } from '../styles/containers.js'
import { linkStyle } from '../styles/link.js'

import { AboutModal } from './AboutModal.jsx'
import { SupportModal } from './SupportModal.jsx'
import { TermsModal } from './Terms.jsx'




export function Nav() {
  const [aboutOpen, setAboutOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)

  return (
    <div>
      <nav style={navStyle}>
        <button onClick={() => setAboutOpen(true)} style={linkStyle}>
          about
        </button>
        <button onClick={() => setSupportOpen(true)} style={linkStyle}>
          support
        </button>
        <button onClick={() => setTermsOpen(true)} style={linkStyle}>
          terms
        </button>
      </nav>
      <SupportModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </div>
  )
}