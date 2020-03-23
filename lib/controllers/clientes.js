const facResponse = require('../facade/response')
const clientesModel = require('../models/clientes')

async function get(req, res, next) {
  try {
    const result = await getClientes()

    return facResponse.respRequest(res, {statusCode: 200, textToShow: {result}})
  } catch (err) {
    next()
  }
}

async function create(req, res, next) {
  try {
    const {cliente} = req.session_data
    // Guardamops el cliente
    const resultAddClient = await clientesModel.add(cliente)
    if (!resultAddClient) {
      return facResponse.respRequest(res, {statusCode: 500, textToShow: {result: resultAddClient}})
    }

    return facResponse.respRequest(res, {statusCode: 200, textToShow: {result: resultAddClient}})
  } catch (err) {
    next(err)
  }
}

async function getClientes() {
  const result = await clientesModel.get({
    select: {
      name: 1,
      lastname: 1,
      degree: 1
    }
  })

  return result
}

module.exports = {
  get,
  create
}
