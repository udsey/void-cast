import './config.js'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { castsRoute } from './routes/casts.js'
import sseRoute from './routes/sse.js'
import { parse } from 'node:path'

const app = Fastify({
  logger: true,
})

// plugins
await app.register(cors, {
  origin: process.env.CLIENT_URL
})

// routes
await app.register(sseRoute, { prefix: '/api' })
await app.register(castsRoute, { prefix: '/api' })

// health check endpoint
app.get('/health', async () => {
  return { status: 'ok' }
})

// start
try {
  await app.listen({
    port: parseInt(process.env.PORT),
    host: '0.0.0.0'
  })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}