const path = require('path')
const apiv0 = require('./routes/v0')
const index = require('./routes')

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const config = require('config')

const app = express()

// Settings

app.use('/static', express.static(path.normalize(path.join(__dirname, '../', 'static'))))
app.set('views', path.join(__dirname, '../', 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true, // Para procesardatos
  parameterLimit: 50000
}))
app.use(session({
  secret: 'CRMMutualSanALbertoMagno',
  resave: false,
  saveUninitialized: false
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
  const stack = err.stack

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
