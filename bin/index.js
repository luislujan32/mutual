const http = require('http')
const config = require('config')

const app = require('../lib')
const {connect} = require('../lib/models')
const banner = require('../lib/utils/banner')

const server = http.createServer(app)
server.on('error', onError)
server.on('listening', onListening)

connect()
  .then(async () => {
    console.log('MongoDB connected')
    server.listen(config.http.port, config.http.host)
  })
  .catch(err => {
    onError(err)
  })

async function onError(err) {
  console.error('UNCAUGHT EXCEPTION', err)
}

function onListening() {
  console.log(banner(config.env, config.http.host, config.http.port))
}

process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION', err)
})

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: \nPROMISE', p, '\nREASON:', reason)
})
