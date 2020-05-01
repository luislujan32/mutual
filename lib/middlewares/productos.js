const facResponse = require('../facade/response')
const productValidations = require('../validations/productos')

async function validate(req, res, next) {
  try {
    req.session_data = {}
    const values = {}

    if (req.method === 'PUT') {
      values.action = 'create'
      values.producto = req.body
    }

    if (req.method === 'DELETE') {
      values.action = 'delete'
      values.id = req.body.id
    }

    if (req.method === 'GET') {
      values.action = 'get'
      values.id = req.params.id
    }

    if (req.method === 'POST') {
      values.action = 'update'
      values.id = req.params.id
      values.producto = req.body
    }

    const validation = productValidations.validate(values)
    if (validation.result === 'validation-errors') {
      return facResponse.respRequest(res, {statusCode: 422, textToShow: {result: validation}})
    }
    if (validation.result === 'error') {
      return facResponse.respRequest(res, {statusCode: 500, textToShow: {result: validation}})
    }

    if (validation.data.producto) {
      req.session_data.producto = validation.data.producto
    }

    if (validation.data.productId) {
      req.session_data.productId = validation.data.productId
    }

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  validate
}
