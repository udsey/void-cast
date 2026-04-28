import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { useWordCloud } from '../hooks/useWordCloud.js'
import { getPositionAtTime } from '../utils/movement.js'

// ── tuneable variables ──────────────────────────────
const SHRINK_DURATION    = parseInt(import.meta.env.VITE_SHRINK_DURATION)
const NEW_CAST_SIZE_MULT = parseFloat(import.meta.env.VITE_NEW_CAST_SIZE_MULT)
const INITIAL_ZOOM       = parseFloat(import.meta.env.VITE_INITIAL_ZOOM)
// ────────────────────────────────────────────────────

export function VoidCloud({ casts, initialPosition, onViewChange }) {  // ← ADD onViewChange
  const svgRef = useRef(null)
  const animationRefs = useRef(new Map())
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  const words = useWordCloud(casts)

  // Get current view center in world coordinates
  const getCurrentViewCenter = useCallback(() => {
    if (!svgRef.current) return { x: 0, y: 0 }

    const s_height = svgRef.current.height.baseVal.value
    const s_width = svgRef.current.width.baseVal.value

    console.log('svgRef.current:', s_height, s_width)  // ← Log svgRef
    
    const transform = d3.zoomTransform(svgRef.current)
    const width = dimensions.width
    const height = dimensions.height
    const centerX = (width / 2 - transform.x) / transform.k
    const centerY = (height / 2 - transform.y) / transform.k
    
    return { x: centerX, y: centerY }
  }, [dimensions])

  // handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // setup zoom with initial position support and view tracking
  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    const g = svg.select('g.cloud-group')
    console.log('Setting up zoom - initialPosition:', initialPosition)  // ← Log initial position

    let initialTransform
    
    if (initialPosition) {
      initialTransform = d3.zoomIdentity
        .translate(dimensions.width / 2, dimensions.height / 2)
        .scale(INITIAL_ZOOM)
        .translate(-initialPosition.x, -initialPosition.y)
    } else {
      initialTransform = d3.zoomIdentity
        .translate(dimensions.width / 2, dimensions.height / 2)
        .scale(INITIAL_ZOOM)
    }

    const zoom = d3.zoom()
      .scaleExtent([0.2, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
        // Notify parent of view change
        if (onViewChange) {
          const center = getCurrentViewCenter()
          onViewChange(center)
        }
      })

    svg.call(zoom)
    svg.call(zoom.transform, initialTransform)
    
    // Initial view center notification
    if (onViewChange) {
      setTimeout(() => {
        const center = getCurrentViewCenter()
        onViewChange(center)
      }, 100)
    }
  }, [dimensions, initialPosition, onViewChange, getCurrentViewCenter])

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      animationRefs.current.forEach((id) => {
        if (id) cancelAnimationFrame(id)
      })
      animationRefs.current.clear()
    }
  }, [])


  const startDrift = useCallback((element, word) => {
    if (animationRefs.current.has(element)) {
      cancelAnimationFrame(animationRefs.current.get(element))
    }
    
    const animate = () => {

      const { x, y } = getPositionAtTime(word)
      element.attr('transform', `translate(${x},${y})`)
      
      const frameId = requestAnimationFrame(animate)
      animationRefs.current.set(element, frameId)

    }
    
    animate()
}, [])






  // render and animate words
  useEffect(() => {
    if (!words.length || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    const g = svg.select('g.cloud-group')

    const text = g
      .selectAll('text')
      .data(words, (d) => d.id)

    // Stop animations for exiting elements
    text.exit().each(function() {
      const el = d3.select(this)
      if (animationRefs.current.has(el.node())) {
        cancelAnimationFrame(animationRefs.current.get(el.node()))
        animationRefs.current.delete(el.node())
      }
    }).remove()

    const entered = text.enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-family', 'Impact, sans-serif')
      .attr('font-weight', 'bold')
      .attr('fill', 'white')
      .attr('pointer-events', 'none')
      .attr('data-id', (d) => d.id)

    // existing words - render at their deterministic position
    entered.filter((d) => !d.isNew)
      .attr('font-size', (d) => `${d.fontSize}px`)
      .attr('opacity', 0.8)
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .each(function(d) {
        const el = d3.select(this)
        d.text.split('\n').forEach((line, i) => {
          el.append('tspan')
            .attr('x', 0)
            .attr('dy', i === 0 ? 0 : '1.2em')
            .text(line)
        })
        // Start deterministic drift
        startDrift(el, d)
      })

          // new cast - animated entrance, then deterministic drift
    entered.filter((d) => d.isNew)
      .each(function(d) {
        const el = d3.select(this)
        const finalSize = d.fontSize
        
        // render tspan lines
        d.text.split('\n').forEach((line, i) => {
          el.append('tspan')
            .attr('x', 0)
            .attr('dy', i === 0 ? 0 : '1.2em')
            .text(line)
        })
        

        el
          .attr('font-size', `${finalSize * NEW_CAST_SIZE_MULT}px`)
          .attr('transform', `translate(${d.x},${d.y})`)
          .attr('opacity', 0)
          .transition()
          .duration(400)
          .attr('opacity', 1)
          .transition()
          .duration(SHRINK_DURATION)
          .ease(d3.easeCubicOut)
          .attr('font-size', `${finalSize}px`)
          .on('start', () => {
            startDrift(el, d)
          })
      })

    // Update existing words that might have changed
    text.each(function(d) {
      const el = d3.select(this)
      if (!animationRefs.current.has(el.node())) {
        startDrift(el, d)
      }
    })

  }, [words, startDrift])

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