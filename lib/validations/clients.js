
function validate(params) {
  try {
    const {client, action} = params

    const errorList = []

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
