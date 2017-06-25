const express = require('express')
const massive = require('massive')
const bodyParser = require('body-parser')

let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

connectDatabase()
  .then(setupRoutes)
  .then(startServer)
  .catch(console.log)

function connectDatabase () {
  return massive({
    host: '127.0.0.1',
    port: 5432,
    username: 'miami_scheduler'
  })
}

function setupRoutes (db) {
  app.get('/', (req, res) => {
    res.send('derp')
  })
}

function startServer () {
  app.listen(3000, () => {
    console.log('server running at http://localhost:3000')
  })
}
