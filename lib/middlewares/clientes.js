const facResponse = require('../facade/response')
const clientValidations = require('../validations/clients')

async function validate(req, res, next) {
  try {

    let action
    if (req.method === 'PUT') {
      action = 'create'
    }
    if (req.method === 'POST') {
      action = 'update'
    }

    const client = clientValidations.validate({
      client: req.body,
      action
    })
    if (client.result === 'validation-errors') {
      return facResponse.respRequest(res, {statusCode: 422, textToShow: {result: client}})
    }
    if (client.result === 'error') {
      return facResponse.respRequest(res, {statusCode: 500, textToShow: {result: client}})
    }

    req.session_data = {
      cliente: client.client
    }

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  validate
}
