const MongoClient = require('mongodb')
const config = require('config')

// Mongodb connection
let connection = null

async function connect() {
  try {
    connection = await MongoClient.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`)
  } catch (err) {
    throw new Error(err)
  }
}

exports.connect = connect
exports.db = () => {
  return connection
}
