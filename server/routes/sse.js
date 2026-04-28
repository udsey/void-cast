import fp from 'fastify-plugin'

async function sseRoute(app) {
  const clients = new Set()

  app.decorate('sse', {
    broadcast: (data) => {
      const message = `data: ${JSON.stringify(data)}\n\n`
      clients.forEach((client) => client.write(message))
    }
  })

  app.get('/sse', (request, reply) => {
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
      console.log('🔴 Client disconnected, total clients:', clients.size)
    })
    console.log('🟢 Client connected, total clients:', clients.size)
  })
}

export default fp(sseRoute)