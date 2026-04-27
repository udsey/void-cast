import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useWordCloud } from '../hooks/useWordCloud.js'

export function VoidCloud({ casts }) {
  const svgRef = useRef(null)
  const width = window.innerWidth
  const height = window.innerHeight

  const words = useWordCloud(casts, width, height)

  useEffect(() => {
    if (!words.length || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    const g = svg.select('g.cloud-group')

    // debug: log first word to check if positions exist
    console.log('📊 First word:', words[0])

    const text = g
      .selectAll('text')
      .data(words, (d) => d.id)

    // Remove old elements first
    text.exit().remove()

    // Create new elements
    text.enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-family', 'Impact, sans-serif')
      .attr('font-weight', 'bold')
      .attr('font-size', (d) => `${d.size}px`)
      .attr('fill', () => `hsl(${Math.random() * 360}, 70%, 60%)`)
      .attr('opacity', 0.8)
      .attr('pointer-events', 'none')
      .attr('transform', (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
      .text((d) => d.text)

    // Set zoom after elements exist
    const zoom = d3.zoom()
      .scaleExtent([0.3, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

  }, [words])

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ 
        background: '#0a0a0a', 
        cursor: 'grab',
        display: 'block'
      }}
    >
      <g
        className="cloud-group"
        transform={`translate(${width / 2}, ${height / 2})`}
      />
    </svg>
  )
}