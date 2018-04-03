export default {
  terms: [],
  searchedCourses: [],
  loadingCourses: [],
  selectedCourses: [],
  coursesByCode: {},
  sectionsByCrn: {},
  generatedSchedules: [],
  currentSchedule: 0,
  scheduleView: 'detailed',
  scheduleSort: 'start_time_asc',
  scheduleFilters: [
    {
      id: 1,
      type: 'class_time',
      operator: 'start_after',
      time: '10:00 AM',
      days: ['M', 'W', 'F']
    }
  ]
};
