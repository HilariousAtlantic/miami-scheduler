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

export function generateSchedules(courses) {
  const schedules = getSchedules(courses);
  return schedules;
}
