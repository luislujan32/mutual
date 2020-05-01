const {db} = require('../models')

async function get(data) {
  try {
    const aggregate = [
      {
        $match: workQuery(data)
      }
    ]

    if (data.select) {
      aggregate.push({$project: data.select})
    }

    if (data.sort) {
      aggregate.push({$sort: data.sort})
    }
    let result
    if (data.findOne) {
      result = await db().collection('productos').aggregate(aggregate).toArray()
      return result[0]
    }

    result = await db().collection('productos').aggregate(aggregate).map(mapProduct).toArray()
    return result
  } catch (err) {
    throw err
  }
}

async function add(producto) {
  try {
    const result = await db().collection('productos').insert(producto)
    if (result.result.ok) {
      return result.ops[0]._id
    }
    throw new Error(`Producto no guardado. Data: ${producto}`)
  } catch (err) {
    throw err
  }
}

async function update(find, data) {
  try {
    const cursor = await db().collection('productos').update(workQuery(find), {$set: data})
    if (cursor.result.ok && cursor.result.n === 0) {
      return {result: 'fail', message: 'not found'}
    }

    if (cursor.result.ok && cursor.result.n === 1 && cursor.result.nModified === 0) {
      return {result: 'fail', message: 'not modified'}
    }

    if (cursor.result.ok && cursor.result.n === 1 && cursor.result.nModified === 1) {
      return {result: 'success'}
    }

    throw new Error(`Product not updated. Find: '${find}'`)
  } catch (err) {
    throw err
  }
}

async function remove(query) {
  try {
    const result = await db().collection('productos').remove(workQuery(query))
    if (result.result.n === 1 && result.result.ok === 1) {
      return {result: 'success', message: 'deleted'}
    } else if (result.result.n === 0 && result.result.ok === 1) {
      return {result: 'error', message: 'Invalid suplied Id'}
    }
    return {result: 'error', message: JSON.stringify(result.result)}
  } catch (err) {
    throw err
  }
}

function mapProduct(u) {
  if (u.type === '1') {
    u.type = 'Indumentaria'
  } else if (u.type === '2') {
    u.type = 'Artículos librería'
  } else if (u.type === '3') {
    u.type = 'Libros'
  }

  return u
}

function workQuery(data) {
  const query = {}

  if (data.id) {
    query._id = data.id
  }

  if (data.status) {
    query.status = data.status
  }

  return query
}

module.exports = {
  get,
  add,
  update,
  remove
}
