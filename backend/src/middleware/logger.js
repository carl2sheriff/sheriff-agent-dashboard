function logger(req, res, next) {
  const start = Date.now()
  const { method, url, ip } = req

  res.on('finish', () => {
    const duration = Date.now() - start
    const timestamp = new Date().toISOString()
    const status = res.statusCode
    const statusColor = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : status >= 300 ? '\x1b[36m' : '\x1b[32m'
    const reset = '\x1b[0m'
    console.log(`${timestamp} ${statusColor}${status}${reset} ${method} ${url} ${duration}ms`)
  })

  next()
}

module.exports = { logger }
