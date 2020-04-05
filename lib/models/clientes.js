const {db} = require('../models')
const {GRADOS} = require('../utils/values')

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
      result = await db().collection('clientes').aggregate(aggregate).toArray()
      return result[0]
    }

    result = await db().collection('clientes').aggregate(aggregate).map(mapClient).toArray()
    return result
  } catch (err) {
    throw err
  }
}

function mapClient(u) {
  if (u.degree) {
    const search = searchDegree(GRADOS, u.degree)
    u.degree = search.name
  }
  return u
}

function searchDegree(arr, id) {
  return arr.find((arr) => {
    return arr.id === id
  })
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

async function update(find, data) {
  try {
    const cursor = await db().collection('clientes').update(workQuery(find), {$set: data})
    if (cursor.result.ok && cursor.result.n === 0) {
      return {result: 'fail', message: 'not found'}
    }

    if (cursor.result.ok && cursor.result.n === 1 && cursor.result.nModified === 0) {
      return {result: 'fail', message: 'not modified'}
    }

    if (cursor.result.ok && cursor.result.n === 1 && cursor.result.nModified === 1) {
      return {result: 'success'}
    }

    throw new Error(`Cliente not updated. Find: '${find}'`)
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
  remove,
  update
}
