import '../config.js'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db, pool } from './index.js'

await migrate(db, { migrationsFolder: '/app/server/db/migrations' })
console.log('✅ Migrations complete')
await pool.end()
