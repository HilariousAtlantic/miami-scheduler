function getValidSchedules(
  { selectedCourses, coursesByCode, sectionsByCrn },
  onGenerateSchedules
) {
  const courses = selectedCourses.map(code => coursesByCode[code]);

  const schedules = [];
  const indices = new Array(courses.length).fill(0);

  const generate = () => {
    let done = false;
    for (let j = 0; j < 10; j++) {
      const schedule = indices.map((sectionIndex, courseIndex) => {
        const { code, sections } = courses[courseIndex];
        const { crn } = sections[sectionIndex];
        return { code, crn };
      });

      if (isValidSchedule(schedule.map(s => sectionsByCrn[s.crn]))) {
        schedules.push(schedule);
      }

      let carry = 1;
      for (let i = indices.length - 1; i >= 0; i--) {
        indices[i] += carry;
        carry = 0;
        if (indices[i] === courses[i].sections.length) {
          indices[i] = 0;
          carry = 1;
        }
      }
      if (carry === 1) {
        done = true;
        break;
      }
    }
    if (!done) {
      requestAnimationFrame(generate);
    } else {
      onGenerateSchedules(schedules);
    }
  };

  requestAnimationFrame(generate);
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

export function generateSchedules(state) {
  return new Promise((resolve, reject) => {
    if (!state.selectedCourses.length) resolve([]);
    getValidSchedules(state, schedules => resolve(schedules));
  });
}
