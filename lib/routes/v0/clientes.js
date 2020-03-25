const clientesController = require('../../controllers/clientes')
const clientMiddleware = require('../../middlewares/clientes')
const strings = require('../../../config/strings')

const {Router} = require('express')

const PATH = '/clientes'

const router = Router()

router.get('/', [], clientesController.get)
router.get('/:id', [clientMiddleware.validate], clientesController.getById)
router.put('/', [clientMiddleware.validate], clientesController.create)
router.delete('/', [clientMiddleware.validate], clientesController.deleteCustomer)
router.post('/:id', [clientMiddleware.validate], clientesController.updateCustomer)

module.exports = routerRoot => {
  routerRoot.use(PATH, router)
}
