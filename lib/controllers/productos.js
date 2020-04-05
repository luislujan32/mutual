const facResponse = require('../facade/response')
const productosModel = require('../models/productos')

async function get(req, res, next) {
  try {
    const productos = await productosModel.get({
      select: {
        nombre: 1,
        tipo: 1,
        precio: 1,
        talle: 1,
        stock: 1
      }
    })

    return facResponse.respRequest(res, {statusCode: 200, textToShow: {result: productos}})
  } catch (err) {
    next()
  }
}

module.exports = {
  get
}
