const { MongoClient } = require('mongodb');
const { get } = require('axios');
const config = require('../config');

const subjects = require('./subjects.json');

async function run() {
  try {
    const db = await connectDatabase();
    await clearDatabase(db);
    const terms = await fetchTerms();
    await importCourses(db, terms);
    process.exit();
  } catch (error) {
    console.error('Error during import.');
    console.log(error);
  }
}

run();

async function connectDatabase() {
  return MongoClient.connect(config.db);
}

function clearCollection(collection) {
  return new Promise((resolve, reject) => {
    collection.deleteMany({}, (error, success) => {
      if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
}

async function clearDatabase(db) {
  await db.collection('terms').deleteMany({});
  await db.collection('courses').deleteMany({});
}

async function fetchTerms(db) {
  const formatTerm = term => ({
    id: term.termId,
    name: term.name.replace(/ (Semester|Term) /, ' ')
  });

  const res = await get('https://ws.muohio.edu/academicTerms');
  return res.data.academicTerm
    .filter(term => term.displayTerm == 'true')
    .sort((a, b) => b.termId - a.termId)
    .slice(0, 5)
    .map(formatTerm);
}

async function importCourses(db, terms) {
  const Terms = db.collection('terms');
  await Terms.insertMany(terms);
  const Courses = db.collection('courses');
  for (let term of terms) {
    console.log(`Fetching ${term.name} courses...`);
    const sections = await fetchSections(term);
    const courses = formatCourses(sections);
    const result = await Courses.insertMany(courses);
    console.log(`Imported ${result.insertedCount} courses`);
  }
  return true;
}

function formatCourses(sections) {
  return sections.reduce((courses, section) => {
    if (!section.courseSchedules.length) return courses;
    let course = courses.find(
      course =>
        course.code === `${section.courseSubjectCode} ${section.courseNumber}`
    );
    if (!course) {
      course = {
        id:
          section.academicTerm +
          section.courseSubjectCode +
          section.courseNumber,
        term: section.academicTerm,
        subject: section.courseSubjectCode,
        number: section.courseNumber,
        school: section.standardizedDivisionName,
        department: section.traditionalStandardizedDeptName,
        code: `${section.courseSubjectCode} ${section.courseNumber}`,
        title: extractTitle(section),
        description: extractDescription(section),
        credits: extractCredits(section),
        sections: []
      };
      courses.push(course);
    }

    course.sections.push({
      crn: section.courseId,
      name: section.courseSectionCode,
      meets: extractMeets(section.courseSchedules),
      instructors: formatInstructors(section.instructors),
      attributes: formatAttributes(section.attributes)
    });

    return courses;
  }, []);
}

async function fetchSections(term) {
  const res = await Promise.all(
    subjects.map(subject =>
      get(
        `http://ws.miamioh.edu/courseSectionV2/${
          term.id
        }.json?campusCode=O&courseSubjectCode=${subject}`
      )
    )
  );
  return res.reduce(
    (sections, r) => sections.concat(r.data.courseSections),
    []
  );
}

function extractDescription(section) {
  let desc = section.courseDescription;
  return desc ? desc.substring(desc.lastIndexOf('\n') + 1) : '';
}

function extractTitle(section) {
  let pattern = /\d+ ([a-zA-Z, ]+) \(\d/;
  if (section.courseDescription && pattern.test(section.courseDescription)) {
    return section.courseDescription.match(pattern)[1];
  } else {
    return section.courseTitle;
  }
}

function extractCredits(section) {
  const format = credits => parseFloat(credits) || 0;
  return {
    lecture_low: format(section.lectureHoursLow),
    lecture_high: format(section.lectureHoursHigh),
    lab_low: format(section.labHoursLow),
    lab_high: format(section.labHoursHigh)
  };
}

function extractMeets(schedules) {
  return schedules.reduce((meets, schedule) => {
    if (schedule.startDate !== schedule.endDate) {
      meets.push({
        start_date: schedule.startDate,
        end_date: schedule.endDate,
        start_time: toMinutes(schedule.startTime),
        end_time: toMinutes(schedule.endTime),
        days: schedule.days,
        room: schedule.room,
        hall: schedule.buildingCode
      });
    }
    return meets;
  }, []);
}

function toMinutes(time) {
  if (time) {
    let [h, m] = time.split(':');
    return parseInt(h) * 60 + parseInt(m);
  }
  return 0;
}

function formatInstructors(instructors) {
  return instructors.map(instructor => {
    return {
      first_name: instructor.nameFirst,
      last_name: instructor.nameLast,
      prefix: instructor.namePrefix,
      email: `${instructor.username.toLowerCase()}@miamioh.edu`,
      primary: Boolean(instructor.primaryInstructor)
    };
  });
}

function formatAttributes(attributes) {
  return attributes.map(attribute => {
    return {
      code: attribute.attributeCode,
      name: attribute.attributeDescription
    };
  });
}
