const facResponse = require('../facade/response')
const strings = require('../../config/strings')

async function login(req, res, next) {
  try {
    const {email, pass} = req.body

    const objectToShow = {
      result: 'success',
      message: 'Login correcto'
    }

    return facResponse.respRequest(res, { statusCode: 200, textToShow: objectToShow })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  login
}
