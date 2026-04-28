import { Modal } from './Modal.jsx'
import ReactMarkdown from 'react-markdown'
import aboutContent from '../content/support.md?raw'

export function SupportModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ReactMarkdown>{aboutContent}</ReactMarkdown>
    </Modal>
  )
}