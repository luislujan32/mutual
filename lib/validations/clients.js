const moment = require('moment')

function validate(params) {
  try {
    const {client, action} = params

    const errorList = []

    if (action === 'create') {
      client.created = moment().unix()
      client.status = 1
      client.createdBy = 'admin'
    }

    if (errorList.length > 0) {
      return {result: 'validation-errors', errors: errorList}
    }
    return {result: 'success', client}
  } catch (err) {
    return {result: 'error', error: 'err'}
  }
}

module.exports = {
  validate
}
