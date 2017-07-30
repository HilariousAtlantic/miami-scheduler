const express = require('express')
const { MongoClient, ObjectID } = require('mongodb')
const { resolve } = require('path')
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
    db.collection('courses').find(req.query).limit(1000).toArray((error, courses) => {
      if (error) {
        res.sendStatus(404)
      } else {
        res.json(courses.map(formatCourseResponse))
      }
    })
  })

  app.post('/api/schedules', (req, res) => {
    db.collection('courses').find(
      {_id: {$in: req.query.courses.split(',').map(ObjectID)}}
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
    id: course._id,
    school: course.school,
    department: course.department,
    subject: course.subject,
    number: course.number,
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
  let times = {M: [], T: [], W: [], R: [], F: []}
  for (let i = 0; i < schedule.length; i++) {
    for (let meet1 of schedule[i].section.meets) {
      for (let j = i + 1; j < schedule.length; j++) {
        for (let meet2 of schedule[j].section.meets) {
          if (containsSameDay(meet1, meet2) && meet1.start_time < meet2.end_time && meet1.end_time < meet2.start_time) {
            return false
          }
        }
      }
    }
  }
  return true
}

function containsSameDay(meet1, meet2) {
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
    let {subject, number} = course
    let {crn, name} = section
    crns.push(crn)
    for (let meet of section.meets) {
      let {start_time, end_time, room, hall} = meet
      if (start_time) {
        let [h, m] = start_time.split(':')
        meetCount++
        meetTotal += parseInt(h)*60 + parseInt(m)
      }
      for (let day of meet.days) {
        meets[day].push({crn, subject, number, name, start_time, end_time, room, hall})
      }
    }
  }
  return {weight: meetTotal / meetCount, crns, meets}
}