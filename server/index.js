const path = require('path')
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

    const {term, subject, number} = req.query

    db.run(`
      SELECT * FROM sections s
      JOIN meets m on s.crn = m.crn
      WHERE term = '${term}' AND subject = '${subject}' AND number = '${number}'
    `).then(result => result.reduce((sections, section) => {
        let meet = {
          days: section.days,
          start_time: section.start_time,
          end_time: section.end_time,
          start_date: section.start_date,
          end_date: section.end_date,
          room_number: section.room_number,
          building_code: section.building_code,
          building_name: section.building_name
        }
        let found = sections.find(s => s.crn === section.crn);
        if (found) {
          found.meets.push(meet)
        } else {
          sections.push({
            term: section.term,
            crn: section.crn,
            subject: section.subject,
            number: section.number,
            name: section.name,
            title: section.title,
            description: section.description,
            credits_lab_low: section.credits_lab_low,
            credits_lab_high: section.credits_lab_high,
            credits_lecture_low: section.credits_lecture_low,
            credits_lecture_high: section.credits_lecture_high,
            meets: [meet]
          })
        }

        return sections
      }, [])).then(sections => res.json(sections))
  })
}

function startServer () {
  const port = 8000
  app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
  })
}
