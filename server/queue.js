import { db } from './db/index.js'
import { casts } from './db/schema.js'

const FLUSH_INTERVAL = parseInt(process.env.QUEUE_FLUSH_INTERVAL)
const MAX_BATCH = parseInt(process.env.QUEUE_MAX_BATCH)

const queue = []

async function flush() {
  if (queue.length === 0) return 
    const batch = queue.splice(0, MAX_BATCH)
    try {
      await db.insert(casts).values(batch)
    } catch (err) {
      console.error('❌ Queue flush error:', err)
      queue.unshift(...batch)
    }
}

export function enqueue(cast) {
  queue.push(cast)
  if (queue.length >= MAX_BATCH) flush()
}

setInterval(flush, FLUSH_INTERVAL)