const facResponse = require('../facade/response')
const clientesModel = require('../models/clientes')

async function get(req, res, next) {
  try {
    const clientes = await clientesModel.get({
      select: {
        name: 1,
        lastname: 1,
        degree: 1
      }
    })

    const result = {
      clientes,
      total: clientes.length
    }

    return facResponse.respRequest(res, {statusCode: 200, textToShow: {result}})
  } catch (err) {
    next()
  }
}

async function getById(req, res, next) {
  try {
    const {clientId} = req.session_data
    const clientes = await clientesModel.get({
      id: clientId,
      findOne: true,
      select: {
        name: 1,
        lastname: 1,
        dni: 1,
        email: 1,
        address: 1,
        degree: 1,
        phone: 1,
        cellphone: 1,
        responsable: 1
      }
    })

    return facResponse.respRequest(res, {statusCode: 200, textToShow: {clientes}})
  } catch (err) {
    next(err)
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

async function deleteCustomer(req, res, next) {
  try {
    const {clientId} = req.session_data

    const resultDelete = await clientesModel.remove({
      id: clientId
    })

    if (resultDelete.result !== 'success') {
      return facResponse.respRequest(res, {statusCode: 422, textToShow: {result: resultDelete.message}})
    }

    return facResponse.respRequest(res, {statusCode: 200, textToShow: {result: 'deleted'}})
  } catch (err) {
    next(err)
  }
}

async function updateCustomer(req, res, next) {
  try {
    const {clientId} = req.session_data

    return facResponse.respRequest(res, {statusCode: 200, textToShow: {result: 'updated'}})
  } catch (err) {
    next(err)
  }
}

module.exports = {
  get,
  getById,
  create,
  deleteCustomer,
  updateCustomer
}
