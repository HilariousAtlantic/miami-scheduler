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
    db.collection('courses').find(req.query).toArray((error, courses) => {
      if (error) {
        res.sendStatus(404)
      } else {
        res.json(courses.map(course => {
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
        }))
      }
    })
  })

  app.get('/api/courses/:id', (req, res) => {
    db.collection('courses').find({_id: new ObjectID(req.params.id)}).next((error, course) => {
      if (error) {
        res.sendStatus(404)
      } else {
        res.json({
          subject: course.subject,
          number: course.number,
          title: course.title,
          description: course.description,
          credits: course.credits,
          sections: course.sections
        })
      }
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
