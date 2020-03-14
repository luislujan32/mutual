const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')

const log = require('./utils/log')
const issueReporter = require('./utils/issue-reporter')

const apiV0 = require('./routes/v0')
const index = require('./routes')

const app = express()

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}))

app.use(express.static(path.normalize(path.join(__dirname, 'views', 'swagger'))))

apiV0(app)
index(app)

// Handle 404 - Keep this as a last route
app.use((req, res) => {
  res.status(404).json({
    message: '404 Not Found'
  })
})

app.use(async (err, req, res, next) => {
  log.error(err)
  const stack = config.env === 'development' ? err.stack : undefined
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      message: err.message,
      stack
    })
  }

  const issueNumber = await issueReporter(err, req)

  res.status(500).json({
    message: 'Internal Server Error',
    ticketNumber: issueNumber || 0,
    stack
  })
})

module.exports = app
