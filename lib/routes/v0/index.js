const clientesRouter = require('./clientes')
const loginRouter = require('./login')
const mainRouter = require('./main')
const productosRouter = require('./productos')

const {Router} = require('express')

const router = Router()

const PATH = '/v0'

module.exports = app => {
  app.use(PATH, router)
  clientesRouter(router)
  loginRouter(router)
  mainRouter(router)
  productosRouter(router)
}
