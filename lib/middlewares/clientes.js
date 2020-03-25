const facResponse = require('../facade/response')
const clientValidations = require('../validations/clients')

async function validate(req, res, next) {
  try {
    req.session_data = {}
    const values = {}

    if (req.method === 'PUT') {
      values.action = 'create'
      values.client = req.body
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
    }

    const validation = clientValidations.validate(values)
    if (validation.result === 'validation-errors') {
      return facResponse.respRequest(res, {statusCode: 422, textToShow: {result: validation}})
    }
    if (validation.result === 'error') {
      return facResponse.respRequest(res, {statusCode: 500, textToShow: {result: validation}})
    }

    if (validation.data.client) {
      req.session_data.cliente = validation.data.client
    }

    if (validation.data.clientId) {
      req.session_data.clientId = validation.data.clientId
    }

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  validate
}
