const PATH = '/'
const strings = require('../../config/strings')
const {Router} = require('express')

const router = Router()
module.exports = app => {
  app.use(PATH, router)
}
router.get('/', (req, res, next) => {
  try {
    res.render('login', {strings})
  } catch (err) {
    next(err)
  }
})
