const { MongoClient } = require('mongodb')

let dbConnection

let uri = 'mongodb+srv://mongo-tutorial:mongo-tutorial@cluster0.qyn8s5e.mongodb.net/?retryWrites=true&w=majority'

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
      .then(client => {
        dbConnection = client.db()
        return cb()
      })
      .catch(err => {
        console.log(err)
        return cb(err)
      })
  },
  getDb: () => dbConnection
}

