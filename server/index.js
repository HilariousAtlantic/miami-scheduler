const express = require('express')
const { MongoClient } = require('mongodb')
const bodyParser = require('body-parser')

let app = express()

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

connectDatabase()
  .then(setupRoutes)
  .then(startServer)
  .catch(console.log)

function connectDatabase () {
  return new Promise((resolve, reject) => {
    let connection = 'mongodb://localhost:27017/miami-scheduler'
    MongoClient.connect(connection, (error, db) => {
      if (error) {
        reject(error)
      } else {
        resolve(db)
      }
    })
  })
}

function setupRoutes (db) {
  app.get('/api/courses', (req, res) => {
    db.collection('courses').find(req.query).toArray((error, courses) => {
      res.json(courses)
    })
  })
}

function startServer () {
  const port = 8000
  app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
  })
}
