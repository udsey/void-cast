import { Modal } from './Modal.jsx'
import ReactMarkdown from 'react-markdown'
import aboutContent from '../content/about.md?raw'

export function AboutModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <ReactMarkdown>{aboutContent}</ReactMarkdown>
    </Modal>
  )
}