const facResponse = require('../facade/response')
const clientesModel = require('../models/clientes')

async function get(req, res, next) {
  try {
    const result = await clientesModel.get({
      select: {
        nombre: 1,
        apellido: 1,
        curso: 1
      }
    })

    return facResponse.respRequest(res, {statusCode: 200, textToShow: {result}})
  } catch (err) {
    next()
  }
}

async function create(req, res, next) {
  try {
    const {client} = req.session_data



    // Const result = await clientesModel.add(cliente)

    const result = {
      result: 'ok'
    }

    return facResponse.respRequest(res, {statusCode: 200, textToShow: {result}})
  } catch (err) {
    next(err)
  }
}

module.exports = {
  get,
  create
}
