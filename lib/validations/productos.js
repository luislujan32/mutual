const moment = require('moment')
const ObjectId = require('mongodb').ObjectID

function validate(params) {
  try {
    const {producto, action, id} = params

    const userName = 'admin'

    const errorList = []
    const data = {}
    const validProduct = {}

    if (id) {
      if (ObjectId.isValid(id)) {
        data.productId = new ObjectId(id)
      }
    }

    if (producto) {
      if (producto.name) {
        validProduct.name = producto.name
      } else {
        errorList.push({field: 'name', message: 'El campo es requerido'})
      }

      if (producto.price) {
        validProduct.price = parseInt(producto.price, 10)
      } else {
        errorList.push({field: 'price', message: 'El campo es requerido'})
      }

      if (producto.stock) {
        validProduct.stock = parseInt(producto.stock, 10)
      } else {
        errorList.push({field: 'stock', message: 'El campo es requerido'})
      }

      if (producto.type) {
        validProduct.type = producto.type
      } else {
        errorList.push({field: 'type', message: 'El campo es requerido'})
      }

      if (producto.waist) {
        validProduct.waist = producto.waist
      } else {
        errorList.push({field: 'waist', message: 'El campo es requerido'})
      }

      if (producto.descript) {
        validProduct.descript = producto.descript
      }
    }

    if (errorList.length > 0) {
      return {result: 'validation-errors', errors: errorList}
    }

    if (action === 'create') {
      validProduct.descript = null
      validProduct.created = moment().unix()
      validProduct.status = 1
      validProduct.createdBy = userName
      validProduct.lastUpdate = null
      validProduct.updatedBy = null
    }

    if (action === 'update') {
      validProduct.lastUpdate = moment().unix()
      validProduct.updatedBy = userName
    }

    data.producto = validProduct

    return {result: 'success', data}
  } catch (err) {
    return {result: 'error', error: 'err'}
  }
}

module.exports = {
  validate
}
