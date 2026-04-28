export const modalBackdropStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.6)',
  backdropFilter: 'blur(4px)',
  zIndex: 30,
}

export const modalContainerStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 31,
  background: 'rgba(15,15,15,0.95)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '2.5rem',
  width: '70vw',
  maxHeight: '70vh',
  height: 'auto',
  maxWidth: '90vw',
  maxHeight: '80vh',
  overflowY: 'auto',
  color: 'rgba(255,255,255,0.8)',
  fontFamily: 'inherit',
}

export const modalContentStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  lineHeight: 1.7,
  fontSize: '0.95rem',
  color: 'rgba(255,255,255,0.8)',
}