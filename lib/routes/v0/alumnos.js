const alumnosController = require('../../controllers/alumno')
const strings = require('../../../config/strings')
const {Router} = require('express')

const PATH = '/alumnos'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const data = {
      isActive: 'alumnos'
    }

    const alumnos = await alumnosController.get()
    res.render('alumnos', {strings, data, alumnos})
  } catch (err) {
    next(err)
  }
})
router.put('/', [], alumnosController.create)

module.exports = routerRoot => {
  routerRoot.use(PATH, router)
}
