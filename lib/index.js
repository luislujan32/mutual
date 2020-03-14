const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')

const apiv0 = require('./routes/v0')
const index = require('./routes')

const app = express()

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}))

index(app)
apiv0(app)

// Handle 404 - Keep this as a last route
app.use((req, res) => {
  res.status(404).json({
    message: '404 Not Found'
  })
})

app.use(async (err, req, res, next) => {
  const stack = config.env === 'development' ? err.stack : undefined
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      message: err.message,
      stack
    })
  }

  res.status(500).json({
    message: 'Internal Server Error',
    stack
  })
})

module.exports = app
