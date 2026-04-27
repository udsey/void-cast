import { parse } from 'node:path'
import { db } from '../db/index.js'
import { casts } from '../db/schema.js'
import { desc } from 'drizzle-orm'

export async function castsRoute(app) {
  // GET /api/casts - fetch all casts from the database
  app.get('/casts', async (request, reply) => {
    try {
      const allCasts = await db
        .select()
        .from(casts)
        .orderBy(desc(casts.createdAt))
        .limit(parseInt(process.env.CASTS_LIMIT))
      
      return reply.send(allCasts)
      } catch (err) {
      console.error('❌ Cast save error:', err)
      reply.status(500).send({ error: 'Failed to save cast', detail: err.message })
      }
    })

    // POST /api/casts - create a new cast from user input
    app.post('/cast', async (request, reply) => {
      console.log('📨 Received body:', request.body)
      const { text } = request.body
      
      // Basic validation
      if (!text || text.trim() === '') {
        return reply.status(400).send({ error: 'Text cannot be empty' })
      }

      if (text.length > parseInt(process.env.TEXT_SIZE_LIMIT)) {
        return reply.status(400).send({ error: `Text cannot exceed ${process.env.TEXT_SIZE_LIMIT} characters` })
      } 
      
      try {
        console.log('💾 Trying to insert:', text)
        const newCast = await db
        .insert(casts)
        .values({ text: text.trim() })
        .returning()

        // notify SSE clients a new cast was added
        console.log('✅ Inserted:', newCast)
        app.sse.broadcast(newCast[0])

        return reply.status(201).send(newCast[0])
      } catch (err) {
          console.error('❌ Full error:', err)
          reply.status(500).send({ error: err.message })
      }
    })
}