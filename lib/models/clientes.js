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

    const result = await db().collection('clientes').aggregate(aggregate).toArray()
    if (data.findOne) {
      return result[0]
    }
    return result
  } catch (err) {
    throw err
  }
}

async function add(cliente) {
  try {
    const result = await db().collection('clientes').insert(cliente)
    if (result.result.ok) {
      return result.ops[0]._id
    }
    throw new Error(`Clientes no guardado. Data: ${cliente}`)
  } catch (err) {
    throw err
  }
}

async function remove(query) {
  try {
    const result = await db().collection('clientes').remove(workQuery(query))
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
  add,
  get,
  remove
}
