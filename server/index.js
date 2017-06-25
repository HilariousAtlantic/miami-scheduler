const express = require('express')
const bodyParser = require('body-parser')

let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

setupRoutes()

app.listen(3000)

function setupRoutes () {
  app.get('/', (req, res) => {
    res.send('derp')
  })
}
