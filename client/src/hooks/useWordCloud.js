import { useEffect, useRef, useState } from 'react'
import cloud from 'd3-cloud'

export function useWordCloud(casts, width, height) {
  const [words, setWords] = useState([])
  const simulationRef = useRef(null)

  useEffect(() => {
    if (!casts || casts.length === 0) return

    if (simulationRef.current) {
      simulationRef.current.stop()
    }

    const wordEntries = casts.map(cast => ({
      text: cast.text,
      id: cast.id,
      isNew: cast.isNew || false,  // ← preserve isNew
      size: 14 + Math.random() * 28,
    }))

    const layout = cloud()
      .size([width, height])
      .words(wordEntries)
      .padding(10)
      .rotate(() => 0)
      .font('Impact')
      .fontSize(d => d.size)
      .on('end', (computed) => {
        setWords(computed)
      })

    layout.start()
    simulationRef.current = layout

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop()
      }
    }
  }, [casts, width, height])

  return words
}