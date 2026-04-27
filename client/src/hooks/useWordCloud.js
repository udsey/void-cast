import { useEffect, useRef, useState } from 'react';
import * as d3 from "d3";
import cloud from "d3-cloud";


export function useWordCloud(casts, width, height) {
  const [words, setWords] = useState([]);
  const simulationRef = useRef(null);

  useEffect(() => {
    if (!casts || casts.length === 0) {
      return;
    }

    // stop previous simulation if it exists
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    // map casts to d3-cloud format
    const wordEntries = casts.map(cast => ({
      text: cast.text,
      id: cast.id,
      size: 16 + Math.random() * 32, // larger base size for visibility
    }));

    const layout = cloud()
      .size([width, height])
      .words(wordEntries)
      .padding(12)
      .rotate(() => 0)
      .font("Impact")
      .fontSize(d => d.size)
      .timeInterval(10)
      .on("end", (computed) => {
        console.log('☁️ cloud computed:', computed)
        setWords(computed);
      });

    console.log('🚀 starting layout with:', wordEntries.length, 'words', 'size:', width, height)      
    layout.start();
    simulationRef.current = layout;

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    }
  }, [casts, width, height]);

  return words;
}