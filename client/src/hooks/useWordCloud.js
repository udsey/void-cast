import { useRef, useState, useEffect } from 'react'

export function useWordCloud(casts) {
  const [words, setWords] = useState([])
  const seenIds = useRef(new Set())

  useEffect(() => {
    if (!casts || casts.length === 0) return

    const newWords = casts
      .filter((cast) => !seenIds.current.has(cast.id))
      .map((cast) => {
        seenIds.current.add(cast.id)
        
        // Use the deterministic properties from the database
        // If properties don't exist (old data), generate deterministic ones client-side
        return {
          id: cast.id,
          text: cast.text,
          isNew: cast.isNew || false,
          
          // Position from database
          x: cast.x || 0,
          y: cast.y || 0,
          
          // Visual properties
          rotation: cast.rotation || 0,
          fontSize: cast.fontSize || 24,
          
          // Drift pattern from database
            driftDirection: cast.driftDirection || 0,
            driftSpeed: cast.driftSpeed || 5,
            driftStartX: cast.x,  // Store starting position
            driftStartY: cast.y,
          
          // For animation tracking
          driftStartTime: Date.now()
        }
      })

    if (newWords.length === 0) return

    setWords((prev) => [...prev, ...newWords])
  }, [casts])

  return words
}