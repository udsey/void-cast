import { db } from '../db/index.js'
import { casts } from '../db/schema.js'
import { desc, eq, max } from 'drizzle-orm'

// At the top of routes/casts.js, add these with proper fallbacks
const VITE_MAX_LINE_LENGTH = parseInt(process.env.VITE_MAX_LINE_LENGTH) 
const VITE_MAX_LINES = parseInt(process.env.VITE_MAX_LINES) 

// World bounds from env (with fallbacks)
const WORLD_SIZE = parseFloat(process.env.WORLD_SIZE) 
const BASE_FONT_SIZE = parseFloat(process.env.BASE_FONT_SIZE) 
const FONT_SIZE_VARIANCE = parseFloat(process.env.FONT_SIZE_VARIANCE) 

// Drift configuration (with fallbacks)
// Directional drift configuration
const DRIFT_SPEED_MIN = parseFloat(process.env.DRIFT_SPEED_MIN)
const DRIFT_SPEED_MAX = parseFloat(process.env.DRIFT_SPEED_MAX) 

const splitIntoLines = (text) => {
  const normalized = text.trim().replace(/\S+/g, (word) => {
    if (word.length <= VITE_MAX_LINE_LENGTH) return word
    return word.match(new RegExp(`.{1,${VITE_MAX_LINE_LENGTH}}`, 'g')).join(' ')
  })

  const words = normalized.split(' ')
  const lines = []
  let current = ''

  for (const word of words) {
    if (current.length + word.length + 1 <= VITE_MAX_LINE_LENGTH) {
      current = current ? `${current} ${word}` : word
    } else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

// Deterministic seeded random generator
function seededRandom(seed) {
  let state = seed
  return function() {
    state = (state * 1103515245 + 12345) & 0x7fffffff
    return state / 0x7fffffff
  }
}

// Generate deterministic properties for a cast (except position)
function generateDeterministicProperties(castId, text) {
  let seed = 0
  const seedStr = `${castId}-${text}`
  for (let i = 0; i < seedStr.length; i++) {
    seed = ((seed << 5) - seed) + seedStr.charCodeAt(i)
    seed |= 0
  }
  
  const rng = seededRandom(Math.abs(seed))
  
    return {
    rotation: 0,
    fontSize: BASE_FONT_SIZE + (rng() - 0.5) * FONT_SIZE_VARIANCE,
    driftDirection: rng() * Math.PI * 2,
    driftSpeed: DRIFT_SPEED_MIN + rng() * (DRIFT_SPEED_MAX - DRIFT_SPEED_MIN),
  }
}

export async function castsRoute(app) {
  // GET /api/casts
  app.get('/casts', async (request, reply) => {
    try {
      const allCasts = await db
        .select()
        .from(casts)
        .orderBy(desc(casts.createdAt))
      return reply.send(allCasts)
    } catch (err) {
      console.error('Fetch error:', err)
      return reply.send([])
    }
  })

  // POST /api/cast
  app.post('/cast', {
    config: {
      rateLimit: {
        max: parseInt(process.env.RATE_LIMIT_PER_IP),
        timeWindow: '1 minute'}
      }
    }, async (request, reply) => {

    const { text, x, y } = request.body  // ← GET x, y from request

    console.log('📝 Received cast:', { text: text?.substring(0, 50), x, y })

    if (!text || text.trim() === '') {
      return reply.status(400).send({ error: 'Text cannot be empty' })
    }

    const lines = splitIntoLines(text)
    if (lines.length > VITE_MAX_LINES) {
      return reply.status(400).send({
        error: `Too long — max ${VITE_MAX_LINES} lines of ${VITE_MAX_LINE_LENGTH} chars each`
      })
    }

    const formatted = lines.join('\n')

    try {
      // Generate deterministic properties (position will come from user)
      const props = generateDeterministicProperties(0, formatted)
      
      // Insert with user's position
      const [newCast] = await db
        .insert(casts)
        .values({
          text: formatted,
          x: x || 0,  // ← USE USER'S X POSITION (from view center)
          y: y || 0,  // ← USE USER'S Y POSITION (from view center)
          rotation: props.rotation,
          fontSize: props.fontSize,
          driftDirection: props.driftDirection || 0,
          driftSpeed: props.driftSpeed || 10,
        })
        .returning()

      console.log('✅ Cast created at user position:', { x: x || 0, y: y || 0, id: newCast.id })
      
      // Broadcast to SSE clients
      app.sse.broadcast(newCast)
      
      return reply.status(201).send(newCast)
    } catch (err) {
      console.error('❌ Create error:', err)
      return reply.status(500).send({ error: 'Failed to create cast', details: err.message })
    }
  })
}