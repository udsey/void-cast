import './config.js'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { castsRoute } from './routes/casts.js'

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

try {
  await app.listen({
    port: parseInt(process.env.PORT) || 3000,
    host: '0.0.0.0'
  })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}