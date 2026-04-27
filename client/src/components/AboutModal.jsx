import { useEffect } from 'react'

export function AboutModal({ isOpen, onClose }) {

  // close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 30,
        }}
      />

      {/* modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 31,
        background: 'rgba(15,15,15,0.95)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '2.5rem',
        width: '480px',
        maxWidth: '90vw',
        maxHeight: '80vh',
        overflowY: 'auto',
        color: 'rgba(255,255,255,0.8)',
        fontFamily: 'inherit',
      }}>

        {/* close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '0.25rem 0.5rem',
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* content */}
        <div style={contentStyle}>
          <h1 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#fff' }}>
            void-cast
          </h1>
          <p>
            A shared space where thoughts disappear into the infinite.
          </p>
          <p>
            Type something. Let it go.
          </p>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '1.5rem 0' }} />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            Built with React, Fastify, and PostgreSQL.
          </p>
        </div>
      </div>
    </>
  )
}

const contentStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  lineHeight: 1.7,
  fontSize: '0.95rem',
}