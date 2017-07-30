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

    let count = 0

    subjects.forEach(subject => {
      getCourseSections(term, subject)
        .then(sections => {
          Courses.insertMany(sections.reduce((courses, section) => {
            let course = courses.find(course => course.number === section.courseNumber)

            if (!course) {
              course = {
                term: term,
                school: section.standardizedDivisionName,
                department: section.traditionalStandardizedDeptName,
                subject: subject,
                number: section.courseNumber,
                title: extractTitle(section),
                description: extractDescription(section),
                credits: extractCredits(section),
                sections: []
              }
              courses.push(course)
            }

            course.sections.push({
              crn: section.courseId,
              name: section.courseSectionCode,
              meets: extractMeets(section.courseSchedules),
              instructors: formatInstructors(section.instructors),
              attributes: formatAttributes(section.attributes)
            })

            return courses
          }, []), (error, result) => {
            console.log(`[${term}](${count++}/${subjects.length}) added ${error ? 0 : result.insertedCount} courses`)
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

function extractCredits (section) {
  const format = credits => parseFloat(credits) || 0

  return {
    lecture_low: format(section.lectureHoursLow),
    lecture_high: format(section.lectureHoursHigh),
    lab_low: format(section.labHoursLow),
    lab_high: format(section.labHoursHigh)
  }
}

function extractMeets (schedules) {
  return schedules.reduce((meets, schedule) => {
    if (schedule.startDate !== schedule.endDate) {
      meets.push({
        start_date: schedule.startDate,
        end_date: schedule.endDate,
        start_time: schedule.startTime,
        end_time: schedule.endTime,
        days: schedule.days,
        room: schedule.room,
        hall: schedule.buildingCode
      })
    }
    return meets
  }, [])
}

function formatInstructors (instructors) {
  return instructors.map(instructor => {
    return {
      first_name: instructor.nameFirst,
      last_name: instructor.nameLast,
      prefix: instructor.namePrefix,
      email: `${instructor.username.toLowerCase()}@miamioh.edu`,
      primary: Boolean(instructor.primaryInstructor)
    }
  })
}

function formatAttributes (attributes) {
  return attributes.map(attribute => {
    return {
      code: attribute.attributeCode,
      name: attribute.attributeDescription
    }
  })
}
