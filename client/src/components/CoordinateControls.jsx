import { useState } from "react";
import { buttonStyle } from "../styles/buttons";
import { containerStyle } from "../styles/containers.js";
import { encodePosition, generateRandomPosition } from "../utils/coordinates";


export function CoordinateControls({ currentViewPosition }) {

  const [copied, setCopied] = useState(false)

  const handleExplore = () => {
    const pos = generateRandomPosition()
    const encoded = encodePosition(pos.x, pos.y)
    window.location.href = `/${encoded}`
    console.log('Redirecting to random position:', pos, 'Encoded as:', encoded)
  }

  const handleShare = async () => {
    const { x, y } = currentViewPosition
    const encoded = encodePosition(x, y)
    const url = `${window.location.origin}/${encoded}`
    await navigator.clipboard.writeText(url)
    window.history.replaceState(null, '', `/${encoded}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

  }

  return (
    <div style={containerStyle}>
      <button onClick={handleExplore} style={buttonStyle}>explore
</button>
      <button onClick={handleShare} style={buttonStyle}>
        {copied ? 'copied!' : 'share'}
      </button>
    </div>
  )
}