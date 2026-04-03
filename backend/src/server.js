require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { logger } = require('./middleware/logger')
const agentsRouter = require('./routes/agents')
const railwayRouter = require('./routes/railway')

const app = express()
const PORT = process.env.PORT || 3001

// CORS — allow dev origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      callback(new Error(`CORS: Origin ${origin} not allowed`))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(express.json())
app.use(logger)

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'sheriff-dashboard-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Routes
app.use('/api/agents', agentsRouter)
app.use('/api/railway', railwayRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method,
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

app.listen(PORT, () => {
  console.log(`\x1b[32m✓\x1b[0m Sheriff Dashboard Backend running on http://localhost:${PORT}`)
  console.log(`\x1b[36m→\x1b[0m Health: http://localhost:${PORT}/health`)
  console.log(`\x1b[36m→\x1b[0m Agents: http://localhost:${PORT}/api/agents`)
})

module.exports = app
