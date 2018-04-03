function getSchedules(courses) {
  return courses.reduce(
    (schedules, course) => {
      return schedules
        .map(schedule =>
          course.sections.map(section => [
            ...schedule,
            { code: course.code, crn: section.crn }
          ])
        )
        .reduce((schedule, sections) => [...schedule, ...sections], []);
    },
    [[]]
  );
}

function isValidSchedule(sections) {
  const validator = {};
  for (let section of sections) {
    for (let meet of section.meets) {
      for (let day of meet.days) {
        for (let time = meet.start_time; time <= meet.end_time; time += 5) {
          if (time >= 0 && validator[day + time]) {
            return false;
          }
          validator[day + time] = true;
        }
      }
    }
  }
  return true;
}

export function generateSchedules({
  selectedCourses,
  coursesByCode,
  sectionsByCrn
}) {
  if (!selectedCourses.length) return [];
  const courses = selectedCourses.map(code => coursesByCode[code]);
  const schedules = getSchedules(courses);
  return schedules.filter(schedule =>
    isValidSchedule(schedule.map(s => sectionsByCrn[s.crn]))
  );
}
