export default {
  terms: [],
  searchedCourses: [],
  loadingCourses: [],
  selectedCourses: [],
  coursesByCode: {},
  sectionsByCrn: {},
  generatedSchedules: [],
  currentSchedule: 0,
  showFilters: true,
  scheduleFilters: {
    hideFullSchedules: false,
    fadeFullSections: true,
    start_time: {
      M: 0,
      T: 0,
      W: 0,
      R: 0,
      F: 0
    },
    end_time: {
      M: 1440,
      T: 1440,
      W: 1440,
      R: 1440,
      F: 1440
    },
    class_load: {
      M: 0,
      T: 0,
      W: 0,
      R: 0,
      F: 0
    }
  }
};
