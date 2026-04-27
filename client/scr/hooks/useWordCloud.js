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
        return {
          id: cast.id,
          text: cast.text,
          isNew: cast.isNew || false,
          size: 14 + Math.random() * 28,
          rotate: 0,
        }
      })

    if (newWords.length === 0) return

    setWords((prev) => [...prev, ...newWords])
  }, [casts])

  return words
}