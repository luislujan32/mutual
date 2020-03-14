function respRequest(res, params) {
  let obj = {}
  const statusCode = params.statusCode
  const textToShow = params.textToShow
  switch (statusCode) {
    case 200:
      obj = textToShow
      break
    case 201:
    case 202:
      obj.result = textToShow
      break
    case 400:
      obj.message = 'Invalid ID supplied Error'
      obj.errors = textToShow
      break
    case 401:
      obj.message = 'Authentication Error'
      obj.errors = textToShow
      break
    case 403:
      obj.message = 'Forbidden Error'
      obj.errors = textToShow
      break
    case 404:
      obj.message = 'Not Found Error'
      obj.errors = textToShow
      break
    case 422:
      obj.message = 'Validation Error'
      obj.errors = textToShow
      break
    case 500:
      obj.message = 'Internal Server Error'
      obj.errors = textToShow
      break
    default:
      break
  }

  return res.status(statusCode).send(obj)
}
module.exports = {
  respRequest
}
