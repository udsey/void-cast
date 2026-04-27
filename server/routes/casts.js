import { db } from '../db/index.js'
import { casts } from '../db/schema.js'
import { desc } from 'drizzle-orm'

const MAX_LINE_LENGTH = parseInt(process.env.MAX_LINE_LENGTH)
const MAX_LINES = parseInt(process.env.MAX_LINES)

const splitIntoLines = (text) => {
  // first break any word longer than MAX_LINE_LENGTH
  const normalized = text.trim().replace(/\S+/g, (word) => {
    if (word.length <= MAX_LINE_LENGTH) return word
    // chunk it into MAX_LINE_LENGTH pieces
    return word.match(new RegExp(`.{1,${MAX_LINE_LENGTH}}`, 'g')).join(' ')
  })

  const words = normalized.split(' ')
  const lines = []
  let current = ''

  for (const word of words) {
    if (current.length + word.length + 1 <= MAX_LINE_LENGTH) {
      current = current ? `${current} ${word}` : word
    } else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

export async function castsRoute(app) {
  // GET /api/casts
  app.get('/casts', async (request, reply) => {
    try {
      const allCasts = await db
        .select()
        .from(casts)
        .orderBy(desc(casts.createdAt))
        .limit(parseInt(process.env.CASTS_LIMIT) || 200)

      return reply.send(allCasts)
    } catch (err) {
      console.error('❌ Fetch error:', err)
      reply.status(500).send({ error: 'Failed to fetch casts', detail: err.message })
    }
  })

  // POST /api/cast
  app.post('/cast', async (request, reply) => {
    const { text } = request.body

    if (!text || text.trim() === '') {
      return reply.status(400).send({ error: 'Text cannot be empty' })
    }

    const lines = splitIntoLines(text)

    if (lines.length > MAX_LINES) {
      return reply.status(400).send({
        error: `Too long — max ${MAX_LINES} lines of ${MAX_LINE_LENGTH} chars each`
      })
    }

    const formatted = lines.join('\n')

    try {
      const newCast = await db
        .insert(casts)
        .values({ text: formatted })
        .returning()

      app.sse.broadcast(newCast[0])
      return reply.status(201).send(newCast[0])
    } catch (err) {
      console.error('❌ Full error:', err)
      reply.status(500).send({ error: err.message })
    }
  })
}