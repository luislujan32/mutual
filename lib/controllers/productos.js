const facResponse = require('../facade/response')
const productosModel = require('../models/productos')

async function get(req, res, next) {
  try {
    const productos = await productosModel.get({
      select: {
        name: 1,
        type: 1,
        price: 1,
        waist: 1,
        stock: 1
      }
    })

    return facResponse.respRequest(res, {statusCode: 200, textToShow: {result: productos}})
  } catch (err) {
    next()
  }
}

async function create(req, res, next) {
  try {
    const {producto} = req.session_data
    // Guardamops el producto
    const resultAddProduct = await productosModel.add(producto)
    if (!resultAddProduct) {
      return facResponse.respRequest(res, {statusCode: 500, textToShow: {result: resultAddProduct}})
    }

    return facResponse.respRequest(res, {statusCode: 200, textToShow: {result: resultAddProduct}})
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    const {productId} = req.session_data
    const productos = await productosModel.get({
      id: productId,
      findOne: true,
      select: {
        name: 1,
        type: 1,
        price: 1,
        waist: 1,
        stock: 1,
        description: 1
      }
    })

    return facResponse.respRequest(res, {statusCode: 200, textToShow: {productos}})
  } catch (err) {
    next(err)
  }
}

async function updateProduct(req, res, next) {
  try {
    const {productId, producto} = req.session_data

    const result = await productosModel.update({id: productId}, producto)
    if (result.result === 'success') {
      return facResponse.respRequest(res, {statusCode: 200, textToShow: {result: 'updated', message: 'Successful update'}})
    } else if (result.result === 'fail' && result.message === 'not found') {
      return facResponse.respRequest(res, {statusCode: 400, textToShow: {result: 'fail', message: 'Product not updated: Not found'}})
    } else if (result.result === 'fail' && result.message === 'not modified') {
      return facResponse.respRequest(res, {statusCode: 202, textToShow: {result: 'fail', message: 'Nothing to update'}})
    }
  } catch (err) {
    next(err)
  }
}

async function deleteproduct(req, res, next) {
  try {
    const {productId} = req.session_data

    const resultDelete = await productosModel.remove({
      id: productId
    })

    if (resultDelete.result !== 'success') {
      return facResponse.respRequest(res, {statusCode: 422, textToShow: {result: resultDelete.message}})
    }

    return facResponse.respRequest(res, {statusCode: 200, textToShow: {result: 'deleted'}})
  } catch (err) {
    next(err)
  }
}

module.exports = {
  get,
  create,
  getById,
  updateProduct,
  deleteproduct
}
