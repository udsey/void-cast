export const getButtonStyle = (isMobile, isTablet) => ({
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '1rem',
  cursor: 'pointer',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  width: isMobile ? '36px' : isTablet ? '44px' : '52px',
  height:'52px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const CloseButtonStyle = {
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
}