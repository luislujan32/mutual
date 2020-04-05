const strings = require('../../../config/strings')
const productosController = require('../../controllers/productos')

const {Router} = require('express')

const PATH = '/productos'

const router = Router()

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

router.get('/all', [], productosController.get)

module.exports = routerRoot => {
  routerRoot.use(PATH, router)
}
