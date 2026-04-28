import { use, useEffect, useRef } from 'react'
import { CloseButtonStyle } from '../styles/buttons.js'
import { modalBackdropStyle, modalContainerStyle, modalContentStyle } from '../styles/modal.js'

export function Modal({ isOpen, onClose, children }) {

  const contentRef = useRef(null)


  useEffect(() => {
    if (!contentRef.current) return
    const links = contentRef.current.querySelectorAll('a')
    links.forEach(link => link.setAttribute('target', '_blank'))
  }, [isOpen])


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
      <div onClick={onClose} style={modalBackdropStyle} />
      <div style={modalContainerStyle}>
        <button onClick={onClose} style={CloseButtonStyle}>✕</button>
        <div style={modalContentStyle} className="modal-content" ref={contentRef}>
          {children}
        </div>
      </div>
    </>
  )
}