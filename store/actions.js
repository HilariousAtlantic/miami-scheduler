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
  }
};
