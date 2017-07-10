const express = require('express')
const massive = require('massive')
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
  return massive({
    host: '127.0.0.1',
    port: 5432,
    username: 'miami_scheduler',
    database: 'miami_scheduler'
  })
}

function setupRoutes (db) {
  app.get('/api/terms', (req, res) => {
    db.terms.find().then(terms => res.json(terms))
  })

  app.get('/api/courses', (req, res) => {
    db.run(`
      SELECT DISTINCT term, subject, number, title, description
      FROM sections
    `).then(courses => res.json(courses))
  })

  app.get('/api/sections', (req, res) => {
    db.sections.find(req.query)
      .then(sections => Promise.all(sections.map(section => {
        return Promise.all([
          Promise.resolve(section),
          db.meets.find({crn: section.crn}),
          db.attributes.find({crn: section.crn})
        ])
      })))
      .then(results => res.json(results.map(result => {
        let section = result[0]
        section.meets = result[1]
        section.attributes = result[2]
        return section
      })))
  })
}

function startServer () {
  const port = 8000
  app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
  })
}
