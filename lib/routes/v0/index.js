const alumnosRouter = require('./alumnos')
const loginRouter = require('./login')
const mainRouter = require('./main')

const {Router} = require('express')

const router = Router()

const PATH = '/v0'

module.exports = app => {
  app.use(PATH, router)
  alumnosRouter(router)
  loginRouter(router)
  mainRouter(router)
}
