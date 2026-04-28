import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import { Modal } from './Modal.jsx'
import termsContent from '../content/terms.md?raw'

export function TermsModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <ReactMarkdown rehypePlugins={[[rehypeRaw]]}>{termsContent}</ReactMarkdown>
    </Modal>
  )
}