const express = require('express')
const { MongoClient } = require('mongodb')
const { resolve } = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const { get } = require('axios')

const config = require('../config');

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

function connectDatabase() {
  return MongoClient.connect(config.db);
}

function setupRoutes (db) {

  app.get('/api/terms', (req, res) => {
    db.collection('terms').find().toArray((error, terms) => {
      res.json(terms)
    })
  })

  app.get('/api/courses', (req, res) => {
    const { term, subjects, numbers } = req.query;
    let query = { term };
    if (subjects || numbers) query['$and'] = [];
    if (subjects) query['$and'].push({subject: {$in: subjects.toUpperCase().split(',')}})
    if (numbers) query['$and'].push({number: {$regex: '^('+numbers.toUpperCase().replace(',', '|')+')'}})
    db.collection('courses').find(query).sort({subject: 1, number: 1}).limit(100).toArray((error, courses) => {
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
      res.json({
        instructors: getInstructors(courses),
        attributes: getAttributes(courses),
        schedules: generateSchedules(courses)
      })
    })
  })

  app.get('/api/slots', (req, res) => {
    db.collection('courses').find(
      {id: {$in: req.query.courses.split(',')}}
    ).toArray((error, courses) => {
      const {subjects, numbers} = courses.reduce((query, course) => {
        query.subjects.push(course.subject)
        query.numbers.push(course.number)
        return query
      }, {subjects: [], numbers: []})
      get(`http://ws.miamioh.edu/courseSectionV2/201820.json?campusCode=O&courseSubjectCode=${subjects.join(',')}&courseNumber=${numbers.join(',')}`)
        .then(res => res.data.courseSections)
        .then(sections => {
          res.json({
            slots: sections.reduce((slots, section) => {
              slots[section.courseId] = {rem: parseInt(section.enrollmentCountAvailable), cap: parseInt(section.enrollmentCountMax)}
              return slots
            }, {})
          })
        })
    })
  })

  if (process.env.NODE_ENV == 'production') {
    app.get('/', (req, res) => {
      res.sendFile(resolve('public', 'index.html'))
    })
  }
}

function startServer () {
  app.listen(config.port, () => {
    console.log(`server running at http://localhost:${config.port}`)
  });
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

function getInstructors(courses) {
  let instructors = {};
  for (let course of courses) {
    for (let section of course.sections) {
      for (let {first_name, last_name} of section.instructors || []) {
        instructors[first_name + ' ' + last_name] = instructors[first_name + ' ' + last_name] + 1 || 1
      }
    }
  }
  return instructors;
}

function getAttributes(courses) {
  let attributes = {};
  for (let course of courses) {
    for (let section of course.sections) {
      for (let {name} of section.attributes || []) {
        attributes[name] = attributes[name] + 1 || 1
      }
    }
  }
  return attributes;
}

function formatSchedule(schedule) {
  let crns = []
  let instructors = {}
  let attributes = {}
  let meets = {M: [], T: [], W: [], R: [], F: []}
  let meetCount = 0, meetTotal = 0
  for (let {course, section} of schedule) {
    let {code} = course
    let {crn, name} = section
    crns.push(crn)
    section.instructors.forEach(({first_name, last_name}) => instructors[`${first_name} ${last_name}`] = true)
    section.attributes.forEach(({name}) => attributes[name] = true)
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
  instructors = Object.keys(instructors);
  attributes = Object.keys(attributes);
  return {weight: meetTotal / meetCount, crns, meets, instructors, attributes}
}