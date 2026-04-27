import './config.js'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { castsRoute } from './routes/casts.js'
import { fileURLToPath } from 'url'      // ← ADD
import { dirname, join } from 'path'     // ← ADD
import fs from 'fs/promises'             // ← ADD

const __filename = fileURLToPath(import.meta.url)  // ← ADD
const __dirname = dirname(__filename)              // ← ADD

const app = Fastify({ logger: true })

await app.register(cors, {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
})

// SSE inline
const clients = new Set()

app.decorate('sse', {
  broadcast: (data) => {
    const message = `data: ${JSON.stringify(data)}\n\n`
    clients.forEach((client) => client.write(message))
  }
})

app.get('/api/sse', (request, reply) => {
  reply.raw.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  })

  reply.raw.write('data: {"type":"connected"}\n\n')
  clients.add(reply.raw)

  request.raw.on('close', () => {
    clients.delete(reply.raw)
    console.log('Client disconnected, total clients:', clients.size)
  })

  console.log('Client connected, total clients:', clients.size)

  // keep connection open
  return new Promise(() => {})
})


await app.register(castsRoute, { prefix: '/api' })

app.get('/health', async () => ({ status: 'ok' }))

// ──────────────────────────────────────────────────────────────
// ADD THIS: Catch-all route for client-side routing (production)
// ──────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = join(__dirname, '../client/dist')
  
  // Serve static files from client/dist
  await app.register(import('@fastify/static'), {
    root: clientDistPath,
    prefix: '/',  // Serve at root
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
    port: parseInt(process.env.PORT) || 3000,
    host: '0.0.0.0'
  })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}