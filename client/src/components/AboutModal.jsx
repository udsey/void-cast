import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import { Modal } from './Modal.jsx'
import aboutContent from '../content/about.md?raw'

export function AboutModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <ReactMarkdown rehypePlugins={[[rehypeRaw]]}>{aboutContent}</ReactMarkdown>
    </Modal>
  )
}