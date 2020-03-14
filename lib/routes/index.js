const PATH = '/'
const path = require('path')
const {Router} = require('express')
const config = require('config')

const router = Router()
module.exports = app => {
  app.use(PATH, router)
}
router.get('/', (req, res, next) => {
  try {
    res.status(200).json({
      status: 'OK'
    })
    //res.status(200).sendFile(path.normalize(path.join(__dirname, '..', 'views', 'swagger', 'index.html')))
  } catch (err) {
    next(err)
  }
})

router.get('/status.html', (req, res, next) => {
  try {
    res.status(200).send('OK')
  } catch (err) {
    next(err)
  }
})
