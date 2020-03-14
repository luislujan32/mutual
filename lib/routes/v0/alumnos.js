const alumnosController = require('../../controllers/alumno')

const {Router} = require('express')

const PATH = '/alumnos'

const router = Router()

router.get('/', [], alumnosController.get)
router.put('/', [], alumnosController.create)

module.exports = routerRoot => {
  routerRoot.use(PATH, router)
}
