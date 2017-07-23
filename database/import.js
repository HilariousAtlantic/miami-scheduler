const { MongoClient } = require('mongodb')
const { get } = require('axios')

const subjects = require('./subjects.json')

Promise.all([connectDatabase(), fetchTerms()])
  .then(([db, termResponses]) => {
    importSections(db, termResponses.map(res => res.data.termId))
  }).catch(console.log)

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

function fetchTerms () {
  return Promise.all([
    get('https://ws.muohio.edu/academicTerms/current'),
    get('https://ws.muohio.edu/academicTerms/next')
  ])
}

function importSections (db, terms) {
  const Courses = db.collection('courses')

  terms.forEach(term => {
    Courses.deleteMany({term}, (error, result) => {
      if (error) {
        console.error(error)
      } else {
        console.log(`deleted ${result.deletedCount} courses`)
      }
    })

    subjects.forEach(subject => {
      getCourseSections(term, subject)
        .then(sections => {
          Courses.insertMany(sections.reduce((courses, section) => {
            let course = courses.find(course => course.number === section.courseNumber)

            if (!course) {
              course = {
                term: term,
                subject: subject,
                number: section.courseNumber,
                title: extractTitle(section),
                description: extractDescription(section),
                sections: []
              }
              courses.push(course)
            }

            course.sections.push({
              name: section.courseSectionCode,
              meets: section.courseSchedules.filter(schedule => schedule.scheduleTypeCode === 'CLAS'),
              exams: section.courseSchedules.filter(schedule => schedule.scheduleTypeCode !== 'CLAS'),
              instructors: section.instructors,
              attributes: section.attributes
            })

            return courses
          }, []), (error, result) => {
            if (error) {
              console.error(error)
            } else {
              console.log(`added ${result.insertedCount} courses`)
            }
          })
        })
    })
  })
}

function getCourseSections (term, subject) {
  return get(`http://ws.miamioh.edu/courseSectionV2/${term}.json?campusCode=O&courseSubjectCode=${subject}`)
    .then(response => response.data.courseSections || [])
}

function extractDescription (section) {
  let desc = section.courseDescription
  return desc ? desc.substring(desc.lastIndexOf('\n') + 1) : ''
}

function extractTitle (section) {
  let pattern = /\d+ ([a-zA-Z ]+) \(\d/
  if (section.courseDescription && pattern.test(section.courseDescription)) {
    return section.courseDescription.match(pattern)[1]
  } else {
    return section.courseTitle
  }
}
