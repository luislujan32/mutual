const path = require('path')

const config = {}

config.db = {
  name: 'mutual',
  host: 'localhost',
  port: 27017
}

config.http = {
  host: '0.0.0.0',
  port: 3000
}

config.env = 'ALPHA VERSION'

module.exports = config
