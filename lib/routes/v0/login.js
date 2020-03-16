const loginController = require('../../controllers/login')

const { Router } = require('express')

const PATH = '/login'

const router = Router()

router.post('/', [], loginController.login)

module.exports = routerRoot => {
  routerRoot.use(PATH, router)
}
