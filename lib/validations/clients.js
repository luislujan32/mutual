const moment = require('moment')
const ObjectId = require('mongodb').ObjectID

function validate(params) {
  try {
    const {client, action, id} = params

    const errorList = []
    const data = {}

    if (action === 'create') {
      client.created = moment().unix()
      client.status = 1
      client.createdBy = 'admin'
    }

    if (id) {
      if (ObjectId.isValid(id)) {
        data.clientId = new ObjectId(id)
      }
    }

    if (client) {
      data.client = client
    }

    if (errorList.length > 0) {
      return {result: 'validation-errors', errors: errorList}
    }
    return {result: 'success', data}
  } catch (err) {
    return {result: 'error', error: 'err'}
  }
}

module.exports = {
  validate
}
