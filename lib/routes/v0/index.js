const alumnosRouter = require('./alumnos')

const {Router} = require('express')

const router = Router()

const PATH = '/v0'

module.exports = app => {
  app.use(PATH, router)
  alumnosRouter(router)
}
