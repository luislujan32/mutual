const moment = require('moment')
const ObjectId = require('mongodb').ObjectID

function validate(params) {
  try {
    const {client, action, id} = params

    const userName = 'admin'

    const errorList = []
    const data = {}
    const validClient = {}

    if (id) {
      if (ObjectId.isValid(id)) {
        data.clientId = new ObjectId(id)
      }
    }

    if (client) {
      if (client.name) {
        validClient.name = client.name
      } else {
        errorList.push({field: 'name', message: 'El campo es requerido'})
      }

      if (client.lastname) {
        validClient.lastname = client.lastname
      } else {
        errorList.push({field: 'lastname', message: 'El campo es requerido'})
      }

      if (client.dni) {
        validClient.dni = client.dni
      } else {
        errorList.push({field: 'dni', message: 'El campo es requerido'})
      }

      if (client.responsable) {
        validClient.responsable = client.responsable
      } else {
        errorList.push({field: 'responsable', message: 'El campo es requerido'})
      }

      if (client.cellphone) {
        validClient.cellphone = client.cellphone
      } else {
        errorList.push({field: 'cellphone', message: 'El campo es requerido'})
      }

      if (client.degree) {
        validClient.degree = client.degree
      } else {
        errorList.push({field: 'degree', message: 'El campo es requerido'})
      }

      if (client.email) {
        validClient.email = client.email
      } else {
        validClient.email = ''
      }

      if (client.address) {
        validClient.address = client.address
      } else {
        validClient.address = ''
      }

      if (client.phone) {
        validClient.phone = client.phone
      } else {
        validClient.phone = ''
      }
    }

    if (errorList.length > 0) {
      return {result: 'validation-errors', errors: errorList}
    }

    if (action === 'create') {
      validClient.created = moment().unix()
      validClient.status = 1
      validClient.createdBy = userName
      validClient.lastUpdate = null
      validClient.updatedBy = null
    }

    if (action === 'update') {
      validClient.lastUpdate = moment().unix()
      validClient.updatedBy = userName
    }

    data.client = validClient

    return {result: 'success', data}
  } catch (err) {
    return {result: 'error', error: 'err'}
  }
}

module.exports = {
  validate
}
