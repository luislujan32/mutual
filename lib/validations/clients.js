const moment = require('moment')
const ObjectId = require('mongodb').ObjectID

function validate(params) {
  try {
    const {client, action, id} = params

    const errorList = []
    const data = {}

    if (id) {
      if (ObjectId.isValid(id)) {
        data.clientId = new ObjectId(id)
      }
    }

    if (client) {
      if (!client.name) {
        errorList.push({field: 'name', message: 'El campo es requerido'})
      }

      if (!client.lastname) {
        errorList.push({field: 'lastname', message: 'El campo es requerido'})
      }

      if (!client.dni) {
        errorList.push({field: 'dni', message: 'El campo es requerido'})
      }

      if (!client.responsable) {
        errorList.push({field: 'responsable', message: 'El campo es requerido'})
      }

      if (!client.cellphone) {
        errorList.push({field: 'cellphone', message: 'El campo es requerido'})
      }

      if (!client.degree) {
        errorList.push({field: 'degree', message: 'El campo es requerido'})
      }
    }

    if (errorList.length > 0) {
      return {result: 'validation-errors', errors: errorList}
    }

    if (action === 'create') {
      client.created = moment().unix()
      client.status = 1
      client.createdBy = 'admin'
    }

    data.client = client

    return {result: 'success', data}
  } catch (err) {
    return {result: 'error', error: 'err'}
  }
}

module.exports = {
  validate
}
