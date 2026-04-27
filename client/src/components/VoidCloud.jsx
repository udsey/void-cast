import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useWordCloud } from '../hooks/useWordCloud.js'

// ── tuneable variables ──────────────────────────────
const DRIFT_DURATION_MIN = parseInt(import.meta.env.VITE_DRIFT_DURATION_MIN)
const DRIFT_DURATION_MAX = parseInt(import.meta.env.VITE_DRIFT_DURATION_MAX)
const SHRINK_DURATION    = parseInt(import.meta.env.VITE_SHRINK_DURATION)
const NEW_CAST_SIZE_MULT = parseFloat(import.meta.env.VITE_NEW_CAST_SIZE_MULT)
const BASE_FONT_SIZE     = parseInt(import.meta.env.VITE_BASE_FONT_SIZE)
const FONT_SIZE_VARIANCE = parseInt(import.meta.env.VITE_FONT_SIZE_VARIANCE)
const INITIAL_ZOOM       = parseFloat(import.meta.env.VITE_INITIAL_ZOOM)
const BASE_SPREAD = parseFloat(import.meta.env.VITE_BASE_SPREAD)
// ────────────────────────────────────────────────────

export function VoidCloud({ casts, initialPosition }) {  // ← ADD initialPosition prop
  const svgRef = useRef(null)
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  const words = useWordCloud(casts, dimensions.width, dimensions.height)

  // handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // setup zoom with initial position support
  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    const g = svg.select('g.cloud-group')

    let initialTransform
    
    if (initialPosition) {
      // Use provided coordinates from URL
      const tx = dimensions.width / 2 - initialPosition.x * INITIAL_ZOOM
      const ty = dimensions.height / 2 - initialPosition.y * INITIAL_ZOOM
      initialTransform = d3.zoomIdentity
        .translate(tx, ty)
        .scale(INITIAL_ZOOM)
    } else {
      // Fallback to center of screen
      initialTransform = d3.zoomIdentity
        .translate(dimensions.width / 2, dimensions.height / 2)
        .scale(INITIAL_ZOOM)
    }

    const zoom = d3.zoom()
      .scaleExtent([0.2, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)
    svg.call(zoom.transform, initialTransform)
  }, [dimensions, initialPosition])  // ← ADD initialPosition to dependency array

  // render and animate words
  useEffect(() => {
    if (!words.length || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    const g = svg.select('g.cloud-group')

    const spread = BASE_SPREAD * Math.max(1, Math.sqrt(words.length / 10))

    const randomX = () => (Math.random() - 0.5) * dimensions.width * spread
    const randomY = () => (Math.random() - 0.5) * dimensions.height * spread
    const randomSize = () => BASE_FONT_SIZE + (Math.random() - 0.5) * FONT_SIZE_VARIANCE

    const drift = (selection) => {
      const newX = randomX()
      const newY = randomY()
      const rotate = selection.attr('data-rotate')

      selection
        .transition()
        .duration(DRIFT_DURATION_MIN + Math.random() * (DRIFT_DURATION_MAX - DRIFT_DURATION_MIN))
        .ease(d3.easeSinInOut)
        .attr('transform', `translate(${newX},${newY})rotate(${rotate})`)
        .on('end', function() {
          drift(d3.select(this))
        })
    }

    const text = g
      .selectAll('text')
      .data(words, (d) => d.id)

    text.exit().remove()

    const entered = text.enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-family', 'Impact, sans-serif')
      .attr('font-weight', 'bold')
      .attr('fill', 'white')
      .attr('pointer-events', 'none')
      .attr('data-rotate', (d) => d.rotate || 0)
      .attr('data-id', (d) => d.id)

    // existing words
    entered.filter((d) => !d.isNew)
      .attr('font-size', () => `${randomSize()}px`)
      .attr('opacity', 0.8)
      .attr('transform', () => `translate(${randomX()},${randomY()})rotate(0)`)
      .each(function(d) {
        const el = d3.select(this)
        d.text.split('\n').forEach((line, i) => {
          el.append('tspan')
            .attr('x', 0)
            .attr('dy', i === 0 ? 0 : '1.2em')
            .text(line)
        })
        drift(el)
      })

    // new cast
    entered.filter((d) => d.isNew)
      .each(function(d) {
        const el = d3.select(this)
        const finalSize = randomSize()
        const targetX = randomX()
        const targetY = randomY()

        // render tspan lines
        d.text.split('\n').forEach((line, i) => {
          el.append('tspan')
            .attr('x', 0)
            .attr('dy', i === 0 ? 0 : '1.2em')
            .text(line)
        })

        el
          .attr('font-size', `${finalSize * NEW_CAST_SIZE_MULT}px`)
          .attr('transform', `translate(0,0)rotate(0)`)
          .attr('opacity', 0)
          .transition()
          .duration(400)
          .attr('opacity', 1)
          .transition()
          .duration(SHRINK_DURATION)
          .ease(d3.easeCubicOut)
          .attr('font-size', `${finalSize}px`)
          .transition()
          .duration(DRIFT_DURATION_MIN + Math.random() * (DRIFT_DURATION_MAX - DRIFT_DURATION_MIN))
          .ease(d3.easeSinInOut)
          .attr('transform', `translate(${targetX},${targetY})rotate(0)`)
          .on('end', function() {
            drift(d3.select(this))
          })
      })

  }, [words])

  return (
    <svg
      ref={svgRef}
      style={{
        background: '#0a0a0a',
        cursor: 'grab',
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        zIndex: 0
      }}
    >
      <g className="cloud-group" />
    </svg>
  )
}