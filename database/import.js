const massive = require('massive')
const axios = require('axios')
const fs = require('fs');

const subjects = require('./subjects.json')

Promise.all([connectDatabase(), fetchTerms()])
  .then(([db, termResponses]) => {

    importSections(db, termResponses.map(res => res.data.termId))

  })

function connectDatabase() {

  return massive({
    host: '127.0.0.1',
    port: 5432,
    username: 'miami_scheduler',
    database: 'miami_scheduler'
  }).then(db => {
    return db.run(fs.readFileSync('setup.sql', 'utf8'))
      .then(() => db.reload())
  })

}

function fetchTerms() {

  return Promise.all([
    axios.get('https://ws.muohio.edu/academicTerms/current'),
    axios.get('https://ws.muohio.edu/academicTerms/next')
  ])

}

function importSections(db, terms) {

  terms.forEach(term => {

    subjects.forEach(subject => {

      console.log(`fetching sections in ${subject} from ${term}`)

      axios.get(`http://ws.miamioh.edu/courseSectionV2/${term}.json?campusCode=O&courseSubjectCode=${subject}`)
        .then(response => {

          let sections = response.data.courseSections;

          db.sections.insert(sections.map(section => ({
            term: term,
            crn: section.courseId,
            subject: section.courseSubjectCode,
            number: section.courseNumber,
            name: section.courseSectionCode,
            title: extractTitle(section),
            description: extractDescription(section),
            credits_lab_low: parseInt(section.labHoursLow) || 0,
            credits_lab_high: parseInt(section.labHoursHigh) || 0,
            credits_lecture_low: parseInt(section.lectureHoursLow) || 0,
            credits_lecture_high: parseInt(section.lectureHoursHigh) || 0
          }))).then(created => {
            console.log(`added ${created.length} sections in ${subject} from ${term}`)
          })

          db.meets.insert(sections.reduce((meets, section) => {

            for (meet of section.courseSchedules) {

              if (meet.startDate !== meet.endDate) {
                meets.push({
                  crn: section.courseId,
                  days: meet.days,
                  start_time: meet.startTime,
                  end_time: meet.endTime,
                  start_date: meet.startDate,
                  end_date: meet.endDate,
                  room_number: meet.room,
                  building_code: meet.buildingCode,
                  building_name: meet.buildingName
                })
              }

            }

            return meets

          }, [])).then(created => {
            console.log(`added ${created.length} meets in ${subject} from ${term}`)
          })

          db.attributes.insert(sections.reduce((attributes, section) => {

            return attributes.concat(section.attributes.map(attribute => ({
              crn: section.courseId,
              code: attribute.attributeCode,
              description: attribute.attributeDescription
            })))

          }, [])).then(created => {
            console.log(`added ${created.length} attributes in ${subject} from ${term}`)
          })

        })

    })

  })

}

function extractDescription(section) {

  if (!section.courseDescription) return '';

  return section.courseDescription.substring(section.courseDescription.lastIndexOf('\n')+1);

}

function extractTitle(section) {

  let pattern = /\d+ ([a-zA-Z ]+) \(\d/;

  if (!section.courseDescription || !pattern.test(section.courseDescription)) return section.courseTitle

  return section.courseDescription.match(pattern)[1]

}
