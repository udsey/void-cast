import './config.js'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { castsRoute } from './routes/casts.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs/promises'
import rateLimit from '@fastify/rate-limit'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = Fastify({ logger: true, trustProxy: true })

await app.register(rateLimit, {
  global: false,
  max: parseInt(process.env.RATE_LIMIT_GLOBAL),
  timeWindow: '1 minute',
  errorResponseBuilder: (request, context) => ({
    statusCode: 429,
    error: 'Too many casts. Take a moment to enjoy the void.',
  })
})

await app.register(cors, {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
})

// SSE inline with better error handling
const clients = new Set()

app.decorate('sse', {
  broadcast: (data) => {
    try {
      // Validate data before broadcasting
      if (!data || typeof data !== 'object') {
        console.error('Invalid broadcast data:', data)
        return
      }
      
      const message = `data: ${JSON.stringify(data)}\n\n`
      
      clients.forEach((client) => {
        try {
          client.write(message)
        } catch (err) {
          console.error('Error writing to client:', err)
          clients.delete(client)
        }
      })
    } catch (err) {
      console.error('Broadcast error:', err)
    }
  }
})

app.get('/api/sse', (request, reply) => {
  
  reply.raw.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  })

  // Send initial connection message
  const initMessage = 'data: {"type":"connected"}\n\n'
  reply.raw.write(initMessage)
  
  clients.add(reply.raw)
  console.log('🟢 Client connected, total clients:', clients.size)

  request.raw.on('close', () => {
    clients.delete(reply.raw)
    console.log('🔴 Client disconnected, total clients:', clients.size)
  })

  // keep connection open
  return new Promise(() => {})
})

await app.register(castsRoute, { prefix: '/api' })

app.get('/health', async () => ({ status: 'ok' }))

// ──────────────────────────────────────────────────────────────
// Catch-all route for client-side routing (production)
// ──────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = join(__dirname, '../client/dist')
  
  // Serve static files from client/dist
  await app.register(import('@fastify/static'), {
    root: clientDistPath,
    prefix: '/',
  })
  
  // For any route not matching API or static files, serve index.html
  app.setNotFoundHandler(async (request, reply) => {
    if (request.url.startsWith('/api')) {
      return reply.status(404).send({ error: 'API endpoint not found' })
    }
    
    try {
      const indexPath = join(clientDistPath, 'index.html')
      const html = await fs.readFile(indexPath, 'utf-8')
      reply.type('text/html').send(html)
    } catch (err) {
      reply.status(500).send({ error: 'Failed to load app' })
    }
  })
}
// ──────────────────────────────────────────────────────────────

try {
  await app.listen({
    port: parseInt(process.env.PORT),
    host: '0.0.0.0'
  })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}