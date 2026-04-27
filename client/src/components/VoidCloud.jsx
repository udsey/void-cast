import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useWordCloud } from '../hooks/useWordCloud.js'

// ── tuneable variables ──────────────────────────────
const DRIFT_DURATION_MIN  = 36000  // ms — fastest drift
const DRIFT_DURATION_MAX  = 64000  // ms — slowest drift
const SHRINK_DURATION     = 3000   // ms — new cast shrink speed
const NEW_CAST_SIZE_MULT  = 16      // initial size multiplier for new cast (e.g. 4 = 4x normal)
const BASE_FONT_SIZE      = 20     // base font size in px
const FONT_SIZE_VARIANCE  = 20     // ± variance in px (final size = BASE ± random * VARIANCE)
const INITIAL_ZOOM        = 0.5     // initial zoom level (1 = 100%, 0.5 = 50%, 2 = 200%)
// ────────────────────────────────────────────────────

export function VoidCloud({ casts }) {
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

  // setup zoom once
  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    const g = svg.select('g.cloud-group')

    const zoom = d3.zoom()
      .scaleExtent([0.2, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)
    svg.call(
      zoom.transform,
      d3.zoomIdentity
        .translate(dimensions.width / 2, dimensions.height / 2)
        .scale(INITIAL_ZOOM)
    )
  }, [])

  // render and animate words
  useEffect(() => {
    if (!words.length || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    const g = svg.select('g.cloud-group')

    const randomX = () => (Math.random() - 0.5) * dimensions.width * 2
    const randomY = () => (Math.random() - 0.5) * dimensions.height * 2
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
      .attr('fill', () => `hsl(${Math.random() * 360}, 70%, 60%)`)
      .attr('pointer-events', 'none')
      .attr('data-rotate', (d) => d.rotate || 0)
      .attr('data-id', (d) => d.id)
      .text((d) => d.text)

    // existing words — random position, start drifting immediately
    entered.filter((d) => !d.isNew)
      .attr('font-size', () => `${randomSize()}px`)
      .attr('opacity', 0.8)
      .attr('transform', () => `translate(${randomX()},${randomY()})rotate(0)`)
      .each(function() {
        drift(d3.select(this))
      })

    // new cast — center → large → shrink → smoothly drift away
    entered.filter((d) => d.isNew)
      .each(function(d) {
        const el = d3.select(this)
        const finalSize = randomSize()
        const targetX = randomX()
        const targetY = randomY()

        el
          .attr('font-size', `${finalSize * NEW_CAST_SIZE_MULT}px`)
          .attr('transform', `translate(0,0)rotate(0)`)
          .attr('opacity', 0)
          // step 1 — fade in
          .transition()
          .duration(400)
          .attr('opacity', 1)
          // step 2 — shrink to normal size
          .transition()
          .duration(SHRINK_DURATION)
          .ease(d3.easeCubicOut)
          .attr('font-size', `${finalSize}px`)
          // step 3 — smoothly drift to first position (no jump)
          .transition()
          .duration(DRIFT_DURATION_MIN + Math.random() * (DRIFT_DURATION_MAX - DRIFT_DURATION_MIN))
          .ease(d3.easeSinInOut)
          .attr('transform', `translate(${targetX},${targetY})rotate(0)`)
          // step 4 — hand off to continuous drift loop
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