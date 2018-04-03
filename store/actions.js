import axios from 'axios';

import { generateSchedules } from './generator';

const schedulesPerPage = {
  detailed: 1,
  compact: 3
};

const filterDefauls = {
  class_time: {
    operator: 'start_after',
    time: '10:00 AM',
    days: ['M', 'W', 'F']
  },
  class_load: {
    operator: 'at_most',
    amount: 3,
    days: ['M', 'W', 'F']
  },
  break_time: {
    from: '11:00 AM',
    until: '12:00 PM',
    days: ['M', 'W', 'F']
  }
};

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
      selectedTerm: termId,
      selectedCourses: [],
      generatedSchedules: []
    };
  },
  async searchCourses(term, query) {
    if (!query) {
      return {
        searchedCourses: []
      };
    }
    const { data } = await axios.get(`/api/search?term=${term}&query=${query}`);
    return function({ coursesByCode }) {
      return {
        searchedCourses: data.courses,
        coursesByCode: data.courses.reduce((acc, course) => {
          return { ...acc, [course.code]: course };
        }, coursesByCode)
      };
    };
  },
  async fetchSections(code) {
    const { data } = await axios.get(`/api/courses/${code}`);
    return function({
      coursesByCode,
      sectionsByCrn,
      selectedCourses,
      loadingCourses
    }) {
      return {
        selectedCourses: [...selectedCourses, code],
        loadingCourses: loadingCourses.filter(c => c !== code),
        coursesByCode: {
          ...coursesByCode,
          [code]: data.course
        },
        sectionsByCrn: data.course.sections.reduce((acc, section) => {
          return { ...acc, [section.crn]: section };
        }, sectionsByCrn)
      };
    };
  },
  selectCourse(course) {
    return function({ loadingCourses, selectedCourses }) {
      if (
        loadingCourses.includes(course.code) ||
        selectedCourses.includes(course.code)
      ) {
        return {};
      } else {
        return {
          loadingCourses: [...loadingCourses, course.code]
        };
      }
    };
  },
  deselectCourse(code) {
    return function({ selectedCourses }) {
      if (selectedCourses.includes(code)) {
        return {
          selectedCourses: selectedCourses.filter(c => c !== code),
          currentSchedule: 0
        };
      } else {
        return { selectedCourses };
      }
    };
  },
  generateSchedules() {
    return function({ coursesByCode, selectedCourses }) {
      if (selectedCourses.length) {
        const courses = selectedCourses.map(code => coursesByCode[code]);
        return {
          generatedSchedules: generateSchedules(courses)
        };
      } else {
        return {
          generatedSchedules: []
        };
      }
    };
  },
  createFilter(type) {
    return function({ scheduleFilters }) {
      const id = Math.max(...scheduleFilters.map(filter => filter.id)) + 1;
      return {
        scheduleFilters: [
          ...scheduleFilters,
          { id, type, ...filterDefauls[type] }
        ]
      };
    };
  },
  deleteFilter(id) {
    return function({ scheduleFilters }) {
      return {
        scheduleFilters: scheduleFilters.filter(filter => filter.id !== id)
      };
    };
  },
  selectScheduleView(view) {
    return function({ scheduleView }) {
      if (scheduleView !== view) {
        return {
          scheduleView: view,
          currentSchedule: 0
        };
      } else {
        return {};
      }
    };
  },
  selectScheduleSort(sort) {
    return function({ scheduleSort }) {
      if (scheduleSort !== sort) {
        return {
          scheduleSort: sort
        };
      } else {
        return {};
      }
    };
  },
  prevSchedule() {
    return function({ currentSchedule }) {
      return {
        currentSchedule: Math.max(currentSchedule - 1, 0)
      };
    };
  },
  nextSchedule() {
    return function({ currentSchedule, generatedSchedules, scheduleView }) {
      return {
        currentSchedule: Math.min(
          currentSchedule + 1,
          Math.ceil(
            generatedSchedules.length / schedulesPerPage[scheduleView]
          ) - 1
        )
      };
    };
  }
};

function isConflictingSection(section, validator) {
  for (let meet of section.meets) {
    for (let day of meet.days) {
      for (let time = meet.start_time; time <= meet.end_time; time += 5) {
        if (validator[day + time]) {
          return true;
        }
        validator[day + time] = true;
      }
    }
  }
  return false;
}
