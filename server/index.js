const express = require('express')
const { MongoClient } = require('mongodb')
const { resolve } = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

let app = express()

app.use(cors())
app.use(morgan('combined'))
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
        db.collection('courses').dropAllIndexes(err => {
          db.collection('courses').createIndex({
            code: 'text',
            codeWithoutSuffix: 'text',
            codeWithoutSpaces: 'text',
            codeWithoutSpacesOrSuffix: 'text',
            title: 'text',
            description: 'text'
          }, {
            name: 'courseSearch',
            weights: {
              code: 30,
              codeWithoutSuffix: 30,
              codeWithoutSpaces: 30,
              codeWithoutSpacesOrSuffix: 30,
              title: 10,
              description: 5
            }
          })
          resolve(db)
        })
      }
    })
  })
}

function setupRoutes (db) {

  app.get('/api/terms', (req, res) => {
    db.collection('terms').find().toArray((error, terms) => {
      res.json(terms)
    })
  })

  app.get('/api/courses', (req, res) => {
    db.collection('courses').find(
      {term: req.query.term, $text: {$search: req.query.q}},
      {score: {$meta: "textScore"}}
    ).limit(50).sort({score: {$meta: "textScore"}})
    .toArray((error, courses) => {
      if (error) {
        res.sendStatus(404)
      } else {
        res.json(courses.map(formatCourseResponse))
      }
    })
  })

  app.get('/api/schedules', (req, res) => {
    db.collection('courses').find(
      {id: {$in: req.query.courses.split(',')}}
    ).toArray((error, courses) => {
      res.json(generateSchedules(courses))
    })
  })

  if (process.env.NODE_ENV == 'production') {
    app.get('/', (req, res) => {
      res.sendFile(resolve('public', 'index.html'))
    })
  }
}

function startServer () {
  const port = 8000
  app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
  })
}

function formatCourseResponse(course) {
  return {
    id: course.id,
    school: course.school,
    department: course.department,
    code: course.code,
    title: course.title,
    description: course.description,
    credits: course.credits,
    section_count: course.sections.length
  }
}

function generateSchedules(courses, schedules = [], currentSchedule = []) {
  let course = courses[0]
  for (let section of course.sections) {
    schedule = [...currentSchedule, {course, section}]
    if (!isScheduleValid(schedule)) continue
    if (courses.length > 1) {
      generateSchedules(courses.slice(1), schedules, schedule)
    } else {
      schedules.push(formatSchedule(schedule))
    }
  }
  return schedules
}

function isScheduleValid(schedule) {
  for (let i = 0; i < schedule.length; i++) {
    for (let meet1 of schedule[i].section.meets) {
      for (let j = i + 1; j < schedule.length; j++) {
        for (let meet2 of schedule[j].section.meets) {
          if (containsSameDay(meet1, meet2) && (
            meet1.start_time <= meet2.end_time && meet2.start_time <= meet1.end_time ||
            meet2.start_time <= meet1.end_time && meet1.start_time <= meet2.end_time
          )) {
            return false
          }
        }
      }
    }
  }
  return true
}

function containsSameDay(meet1, meet2) {
  if (!meet1.days || !meet2.days) return false;
  for (let day of meet1.days) {
    if (meet2.days.indexOf(day) !== -1) {
      return true
    }
  }
  return false
}

function formatSchedule(schedule) {
  let crns = []
  let meets = {M: [], T: [], W: [], R: [], F: []}
  let meetCount = 0, meetTotal = 0
  for (let {course, section} of schedule) {
    let {code} = course
    let {crn, name} = section
    crns.push(crn)
    for (let {days, start_time, end_time, room, hall} of section.meets) {
      if (start_time) {
        meetCount++
        meetTotal += start_time
      }
      for (let day of (days || [])) {
        meets[day].push({crn, code, name, start_time, end_time, room, hall,
          instructors: section.instructors,
          attributes: section.attributes
        })
      }
    }
  }
  return {weight: meetTotal / meetCount, crns, meets}
}