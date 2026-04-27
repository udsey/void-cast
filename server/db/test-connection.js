import '../config.js'
import { pool } from './index.js'

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err)
  } else {
    console.log('✅ Database connected at:', res.rows[0].now)
  }
  pool.end()
})