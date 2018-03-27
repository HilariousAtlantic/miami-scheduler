const axios = require('axios');
const { connectDatabase } = require('./database');

const subjects = require('./subjects.json');

run();

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

async function clearDatabase(db) {
  await db.terms.destroy();
  await db.courses.destroy();
}

async function fetchTerms(db) {
  const formatTerm = term => ({
    code: term.termId,
    name: term.name.replace(/ (Semester|Term) /, ' ')
  });

  const res = await axios.get('https://ws.muohio.edu/academicTerms');
  return res.data.academicTerm
    .filter(term => term.displayTerm == 'true')
    .sort((a, b) => b.termId - a.termId)
    .slice(0, 5)
    .map(formatTerm);
}

async function importCourses(db, terms) {
  db.terms.insert(terms);
  for (let term of terms) {
    console.log(`Fetching ${term.name} courses...`);
    const sections = await fetchSections(term);
    const courses = extractCourses(sections);
    const result = await db.courses.insert(courses);
    console.log(`Imported ${result.length} courses`);
  }
  return true;
}

function extractCourses(sections) {
  const courses = {};
  for (let section of sections) {
    const code = `${section.academicTerm}${section.courseSubjectCode}${
      section.courseNumber
    }`;
    courses[code] = {
      code,
      term: section.academicTerm,
      subject: section.courseSubjectCode,
      number: section.courseNumber,
      title: extractTitle(section),
      description: extractDescription(section)
    };
  }
  return Object.values(courses);
}

async function fetchSections(term) {
  const res = await Promise.all(
    subjects.map(subject =>
      axios.get(
        `http://ws.miamioh.edu/courseSectionV2/${
          term.code
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
