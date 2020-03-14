const facResponse = require('../facade/response')
const alumnosModel = require('../models/alumnos')

async function get(req, res, next) {
  try {

    const result = await alumnosModel.get({
      select: {
        nombre: 1,
        apellido: 1
      }
    })

    const objectToShow = {
      result
    }
    return facResponse.respRequest(res, {statusCode: 200, textToShow: objectToShow})
  } catch (err) {
    console.log(err)
    next()
  }
}

async function create(req, res, next) {
  try {

    const alumno = req.body

    const result = await alumnosModel.add(alumno)

    const objectToShow = {
      result
    }
    return facResponse.respRequest(res, { statusCode: 200, textToShow: objectToShow })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  get,
  create
}
