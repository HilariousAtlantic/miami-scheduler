function getValidSchedules(getState, onStatus, onFinished) {
  const { selectedCourses, coursesByCode, sectionsByCrn } = getState();
  const courses = selectedCourses.map(code => coursesByCode[code]);

  const totalSchedules = courses.reduce(
    (total, course) => total * course.sections.length,
    1
  );

  const schedules = [];
  const indices = new Array(courses.length).fill(0);

  let scheduleCount = 0;

  const generate = () => {
    const { generatingSchedules } = getState();
    if (generatingSchedules !== selectedCourses.join('')) {
      return;
    }
    let done = false;
    for (let j = 0; j < 50; j++) {
      const schedule = indices.map((sectionIndex, courseIndex) => {
        const { code, sections } = courses[courseIndex];
        const { crn } = sections[sectionIndex];
        return { code, crn };
      });

      scheduleCount++;

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
      onStatus(Math.floor(scheduleCount / totalSchedules * 100));
      requestAnimationFrame(generate);
    } else {
      onFinished(schedules);
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

export function getSchedules(getState, setState) {
  const { selectedCourses } = getState();
  if (!selectedCourses.length) return;
  getValidSchedules(
    getState,
    status =>
      setState({
        generationStatus: status
      }),
    generatedSchedules =>
      setState({
        generatedSchedules,
        generatingSchedules: null
      })
  );
}
