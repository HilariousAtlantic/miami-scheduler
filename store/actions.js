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
    return {
      searchedCourses: data.courses
    };
  }
};
