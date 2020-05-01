const strings = require('../../../config/strings')
const productosController = require('../../controllers/productos')
const producttMiddleware = require('../../middlewares/productos')

const {Router} = require('express')

const PATH = '/productos'

const router = Router()

router.get('/all', [], productosController.get)
router.get('/:id', [producttMiddleware.validate], productosController.getById)
router.post('/:id', [producttMiddleware.validate], productosController.updateProduct)
router.put('/', [producttMiddleware.validate], productosController.create)
router.delete('/', [producttMiddleware.validate], productosController.deleteproduct)

router.get('/', (req, res, next) => {
  try {
    const data = {
      isActive: 'productos'
    }
    res.render('productos', {strings, data})
  } catch (err) {
    next(err)
  }
})

module.exports = routerRoot => {
  routerRoot.use(PATH, router)
}
