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
    console.log(err)
    throw err
  }
}

function workQuery(data) {
  const query = {}

  if (data.status) {
    query.status = data.status
  }

  return query
}

module.exports = {
  add,
  get
}
