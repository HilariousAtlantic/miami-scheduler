require('dotenv');

const express = require('express');
const axios = require('axios');
const sendgrid = require('@sendgrid/mail');
const { uniqWith, isEqual } = require('lodash');

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
    const wheres = [`WHERE term = '${term}'`];

    if (subject.length) {
      wheres.push(
        `subject IN (${subject.map(subject => `'${subject}'`).join(',')})`
      );
    }

    if (number.length) {
      wheres.push(
        `(${number.map(number => `number LIKE '${number}%'`).join(' OR ')})`
      );
    }

    if (wheres.length === 1 && keyword) {
      wheres.push(
        `(UPPER(title) LIKE '${keyword}%' OR UPPER(title) LIKE '% ${keyword}%')`
      );
    }

    try {
      const courses = await db.query(`
        SELECT * 
        FROM courses 
        ${wheres.join(' AND ')}
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

      const term = code.slice(0, 6);
      const subject = code.slice(6, 9);
      const number = code.slice(9);
      const { data } = await axios.get(
        `http://ws.miamioh.edu/courseSectionV2/${term}.json?campusCode=O&courseSubjectCode=${subject}&courseNumber=${number}`
      );
      const sections = data.courseSections
        .filter(section => section.prntInd === 'Y')
        .map(courseSection => {
          const instructor = courseSection.instructors.find(i =>
            Boolean(i.primaryInstructor)
          ) || { nameLast: 'TBA' };

          const attributes = courseSection.attributes.reduce(
            (acc, attr) => ({
              ...acc,
              [attr.attributeCode]: attr.attributeDescription
            }),
            {}
          );

          const credits = [
            ...new Set([
              parseInt(courseSection.creditHoursLow),
              parseInt(courseSection.creditHoursHigh)
            ])
          ];

          const events = uniqWith(
            courseSection.courseSchedules
              .filter(
                courseSchedule =>
                  courseSchedule.scheduleTypeCode === 'CLAS' &&
                  courseSchedule.days &&
                  courseSchedule.startDate &&
                  courseSchedule.endDate &&
                  courseSchedule.startDate !== courseSchedule.endDate
              )
              .map(courseSchedule => ({
                days: courseSchedule.days.split(''),
                start_time: toMinutes(courseSchedule.startTime),
                end_time: toMinutes(courseSchedule.endTime),
                location:
                  courseSchedule.buildingCode && courseSchedule.room
                    ? `${courseSchedule.buildingCode} ${courseSchedule.room}`
                    : 'TBA'
              })),
            isEqual
          );

          return {
            crn: courseSection.courseId,
            name: courseSection.courseSectionCode,
            seats: parseInt(courseSection.enrollmentCountAvailable),
            instructor: instructor.nameLast,
            attributes,
            credits,
            events
          };
        });
      res.json({ sections });
    } catch (e) {
      console.error(e.stack);
      res.json({ sections: [] });
    }
  });

  router.post('/feedback', async (req, res) => {
    const { email, issue, feature } = req.body;
    const msg = {
      to: 'hilariousatlantic@gmail.com',
      from: 'hilariousatlantic@gmail.com',
      subject: `${email.slice(0, email.indexOf('@'))} has submitted feedback`,
      html: `
        <strong>Email</strong>
        <p>${email}</p>

        <strong>Issue</strong>
        <p>${issue || 'None'}</p>

        <strong>Feature</strong>
        <p>${feature || 'None'}</p>
      `
    };
    try {
      await sendgrid.send(msg);
      res.sendStatus(201);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });

  router.get('/donations', async (req, res) => {
    try {
      const donations = await db.donations.find(
        {},
        {
          order: 'amount desc, id'
        }
      );
      res.json({ donations });
    } catch (e) {
      console.error(e.stack);
      res.sendStatus(500);
    }
  });

  router.post('/donations', async (req, res) => {
    const { key } = req.query;
    if (!key || key !== process.env.DONATION_API_KEY) {
      return res.sendStatus(401);
    }
    const { donations } = req.body;
    if (!donations) {
      return res.sendStatus(400);
    }
    try {
      const donation = await db.donations.insert(donations);
      res.json({ donations });
    } catch (e) {
      console.error(e.stack);
      res.sendStatus(500);
    }
  });

  router.delete('/donations/:id', async (req, res) => {
    const { key } = req.query;
    if (!key || key !== process.env.DONATION_API_KEY) {
      return res.sendStatus(401);
    }
    const { id } = req.params;
    try {
      await db.donations.destroy(parseInt(id));
      res.sendStatus(200);
    } catch (e) {
      console.error(e.stack);
      res.sendStatus(500);
    }
  });

  return router;
};
