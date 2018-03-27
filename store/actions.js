import axios from 'axios';

export default {
  async fetchTerms() {
    const { data } = await axios.get('/api/terms');
    return {
      terms: data.terms,
      selectedTerm: data.terms[0].code
    };
  },
  selectTerm(termId) {
    return {
      selectedTerm: termId
    };
  },
  async searchCourses(term, query) {
    const { data } = await axios.get(`/api/search?term=${term}&query=${query}`);
    return function(state) {
      return {
        searchedCourses: data.courses,
        coursesByCode: data.courses.reduce((acc, course) => {
          return { ...acc, [course.code]: course };
        }, state.coursesByCode)
      };
    };
  },
  async fetchSections(code) {
    const { data } = await axios.get(`/api/courses/${code}`);
    return function({ coursesByCode }) {
      return {
        coursesByCode: {
          ...coursesByCode,
          [code]: data.course
        }
      };
    };
  },
  selectCourse(code) {
    return function({ selectedCourses }) {
      if (selectedCourses.includes(code)) {
        return { selectedCourses };
      } else if (selectedCourses.length < 8) {
        return {
          selectedCourses: [...selectedCourses, code]
        };
      }
    };
  },
  deselectCourse(code) {
    return function({ selectedCourses }) {
      if (selectedCourses.includes(code)) {
        return {
          selectedCourses: selectedCourses.filter(c => c !== code)
        };
      } else {
        return { selectedCourses };
      }
    };
  },
  generateSchedules() {
    return function({ coursesByCode, selectedCourses }) {
      const courses = selectedCourses.map(code => coursesByCode[code]);
      if (courses.length) {
        return {
          generatedSchedules: generateSchedules(courses)
        };
      } else {
        return {
          generatedSchedules: []
        };
      }
    };
  }
};

function generateSchedules(
  courses,
  schedules = [],
  currentSchedule = [],
  currentValidator = []
) {
  const course = courses[0];
  for (let section of course.sections) {
    const schedule = [...currentSchedule, section];
    const validator = [...currentValidator];
    if (!addSection(schedule, validator, section)) continue;
    if (courses.length > 1) {
      generateSchedules(courses.slice(1), schedules, schedule, validator);
    } else {
      schedules.push(schedule);
    }
  }
  return schedules;
}

function addSection(schedule, validator, section) {
  for (let meet of section.meets) {
    for (let day of meet.days) {
      for (let time = meet.start_time; time <= meet.end_time; time += 5) {
        if (validator[day + time]) {
          return false;
        }
        validator[day + time] = true;
      }
    }
  }
  return true;
}
