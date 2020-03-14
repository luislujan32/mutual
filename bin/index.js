
const http = require('http')
const config = require('config')

const app = require('../lib')
const {connect} = require('../lib/models')
const banner = require('../lib/util/banner')

const server = http.createServer(app)
server.on('error', onError)
server.on('listening', onListening)

connect()
  .then(async () => {
    console.log('MongoDB connected')
    await facCache.load()
    server.listen(config.http.port, config.http.host)
  })
  .catch(err => {
    onError(err)
  })

async function onError(err) {
  log.error(err)
  await issueReporter(err)
  process.exit(0)
}

function onListening() {
  log.info(banner(config.env, config.http.host, config.http.port))
}

process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION', err)
  issueReporter(err, null, {
    type: 'uncaughtException'
  })
  log.fatal(err.stack || err.message)
})

process.on('unhandledRejection', (reason, p) => {
  issueReporter(reason, null, {
    type: 'unhandledRejection'
  })
  log.fatal('Unhandled Rejection at: \nPROMISE', p, '\nREASON:', reason)
})
