const clientesController = require('../../controllers/clientes')
const clientMiddleware = require('../../middlewares/clientes')
const strings = require('../../../config/strings')

const {Router} = require('express')

const PATH = '/clientes'

const router = Router()

router.get('/', [], clientesController.get)
router.put('/', [clientMiddleware.validate], clientesController.create)

module.exports = routerRoot => {
  routerRoot.use(PATH, router)
}
