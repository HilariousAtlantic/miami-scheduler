require('dotenv');

const express = require('express');
const axios = require('axios');
const sendgrid = require('@sendgrid/mail');
const _ = require('lodash');

function toMinutes(time) {
  if (!time) return -1;
  const [h, m] = time.split(':');
  return 60 * parseInt(h) + parseInt(m);
}

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = function(db) {
  const router = express.Router();

  router.get('/terms', async (req, res) => {
    const terms = await db.terms.find();
    res.json({ terms });
  });

  router.get('/courses', async (req, res) => {
    const { term, query } = req.query;
    if (!term) {
      return res.json({ courses: [] });
    }

    const subjects = require('./subjects.json');
    const parts = (query || '')
      .toUpperCase()
      .replace(/([A-Z]+)(\d+)/g, '$1 $2')
      .split(' ');

    const subject = parts.filter(part => subjects.includes(part));
    const number = parts.filter(part => /\d{1,3}[A-Z]{0,3}/.test(part));
    const keyword = parts[0];
    const where = [`WHERE term = '${term}'`];

    if (subject.length) {
      where.push(
        `subject IN (${subject.map(subject => `'${subject}'`).join(',')})`
      );
    }

    if (number.length) {
      where.push(
        `(${number.map(number => `number LIKE '${number}%'`).join(' OR ')})`
      );
    }

    if (where.length === 1 && keyword) {
      where.push(
        `UPPER(title) LIKE '${keyword}%' OR UPPER(title) LIKE '% ${keyword}%'`
      );
    }

    try {
      const courses = await db.query(`
        SELECT * 
        FROM courses 
        ${where.join(' AND ')}
        ORDER BY subject, number
        LIMIT 200
      `);
      res.json({ courses });
    } catch (e) {
      console.error(e.stack);
      res.json({ courses: [] });
    }
  });

  router.get('/sections', async (req, res) => {
    try {
      const { code } = req.query;
      if (!code) {
        return res.json({ sections: [] });
      }
      const codes = code.split(',');
      const course = await db.courses.find(
        { code: codes },
        {
          fields: ['term', 'subject', 'number'],
          single: true
        }
      );

      const { data } = await axios.get(
        `http://ws.miamioh.edu/courseSectionV2/${
          course.term
        }.json?campusCode=O&courseSubjectCode=${course.subject}&courseNumber=${
          course.number
        }`
      );
      const sections = data.courseSections
        .filter(section => section.courseSchedules.length)
        .map(courseSection => {
          const instructor = courseSection.instructors.find(i =>
            Boolean(i.primaryInstructor)
          );
          return {
            crn: courseSection.courseId,
            name: courseSection.courseSectionCode,
            slots: parseInt(courseSection.enrollmentCountAvailable),
            instructor: instructor ? instructor.nameLast : 'TBA',
            credits: [
              ...new Set([
                parseInt(courseSection.creditHoursLow),
                parseInt(courseSection.creditHoursHigh)
              ])
            ],
            meets: _.uniqWith(
              courseSection.courseSchedules
                .filter(
                  courseSection =>
                    courseSection.scheduleTypeCode === 'CLAS' &&
                    courseSection.startDate !== courseSection.endDate
                )
                .map(courseSchedule => ({
                  days: courseSchedule.days
                    ? courseSchedule.days.split('')
                    : [],
                  start_time: toMinutes(courseSchedule.startTime),
                  end_time: toMinutes(courseSchedule.endTime),
                  location:
                    courseSchedule.buildingCode && courseSchedule.room
                      ? `${courseSchedule.buildingCode} ${courseSchedule.room}`
                      : 'TBA',
                  online: courseSchedule.buildingCode === 'WEB'
                })),
              _.isEqual
            )
          };
        });
      res.json({ sections });
    } catch (e) {
      console.error(e.stack);
      res.json({ sections: [] });
    }
  });

  router.post('/feedback', async (req, res) => {
    const msg = {
      to: 'hilariousatlantic@gmail.com',
      from: 'feedback@miamischeduler.com',
      subject: `${req.body.name} has submitted feedback`,
      html: `
        <strong>Name</strong>
        <p>${req.body.name}</p>

        <strong>Email</strong>
        <p>${req.body.email}</p>

        ${getMessage(req.body)}
      `
    };
    try {
      await sendgrid.send(msg);
      res.sendStatus(201);
    } catch (error) {
      res.sendStatus(400);
    }
  });

  return router;
};

function getMessage(body) {
  switch (body.type) {
    case 'issue':
      return `
        <strong>Feedback Type</strong>
        <p>Issue</p>

        <strong>Issue Description</strong>
        <p>${body.issue_description}</p>

        <strong>Selected Courses</strong>
        <p>${body.issue_courses}</p>

        <strong>Replication Steps</strong>
        <p>${body.issue_replication}</p>
      `;
    case 'suggestion':
      return `
        <strong>Feedback Type</strong>
        <p>Suggestion</p>

        <strong>Suggestion Name</strong>
        <p>${body.suggestion_name}</p>

        <strong>Suggestion Description</strong>
        <p>${body.suggestion_description}</p>
      `;
    case 'review':
      return `
        <strong>Feedback Type</strong>
        <p>Review</p>

        <strong>Rating</strong>
        <p>${body.review_rating}</p>

        <strong>Description</strong>
        <p>${body.review_description}</p>
      `;
  }
}
