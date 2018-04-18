function getValidSchedules(getState, onStatus, onFinished) {
  const { selectedCourses, coursesByCode, sectionsByCode } = getState();
  const courses = selectedCourses.map(code => {
    return { ...coursesByCode[code], sections: sectionsByCode[code] };
  });

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
        const { sections, ...course } = courses[courseIndex];
        const section = sections[sectionIndex];
        return { course, section };
      });

      if (isValidSchedule(schedule)) {
        schedules.push(formatSchedule(schedule));
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
      scheduleCount += 50;
      onStatus(Math.floor(scheduleCount / totalSchedules * 100));
      requestAnimationFrame(generate);
    } else {
      onFinished(schedules);
    }
  };

  requestAnimationFrame(generate);
}

function isValidSchedule(schedule) {
  const validator = {};
  for (let { section } of schedule) {
    for (let event of section.events) {
      for (let day of event.days) {
        for (let time = event.start_time; time <= event.end_time; time += 5) {
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

function formatSchedule(schedule) {
  const sections = [];
  const crns = [];
  const events = [];
  const onlines = [];
  const start_times = { M: 1440, T: 1440, W: 1440, R: 1440, F: 1440 };
  const end_times = { M: 0, T: 0, W: 0, R: 0, F: 0 };
  const class_loads = { M: 0, T: 0, W: 0, R: 0, F: 0 };
  const class_times = { M: [], T: [], W: [], R: [], F: [] };

  const weight_builder = {
    total: 0,
    count: 0
  };

  const credits = {
    low: 0,
    high: 0
  };

  for (let { course, section } of schedule) {
    sections.push({
      crn: section.crn,
      title: `${course.subject} ${course.number} ${section.name}`
    });
    crns.push(section.crn);
    credits.low += section.credits[0];
    credits.high += section.credits[1] || section.credits[0];
    for (let event of section.events) {
      for (let day of event.days) {
        weight_builder.total += event.start_time;
        weight_builder.count++;
        class_loads[day]++;
        class_times[day].push({ start: event.start_time, end: event.end_time });
        start_times[day] = Math.min(start_times[day], event.start_time);
        end_times[day] = Math.max(end_times[day], event.end_time);
        events.push({
          name: `${course.subject} ${course.number} ${section.name}`,
          crn: section.crn,
          day,
          start: event.start_time,
          end: event.end_time,
          location: event.location,
          instructor: section.instructor,
          seats: section.seats
        });
      }
    }
    if (section.attributes['ONL'] || section.attributes['HYB']) {
      onlines.push({
        name: `${course.subject} ${course.number} ${section.name}`,
        crn: section.crn,
        instructor: section.instructor,
        seats: section.seats,
        hybrid: !!section.attributes['HYB']
      });
    }
  }
  return {
    credits:
      credits.low !== credits.high
        ? `${credits.low} - ${credits.high}`
        : credits.low,
    sections,
    crns,
    events,
    onlines,
    start_times,
    end_times,
    class_loads,
    class_times,
    weight: weight_builder.total / weight_builder.count
  };
}

export function getSchedules(getState, setState) {
  return new Promise((resolve, reject) => {
    const { selectedCourses } = getState();
    if (!selectedCourses.length) {
      setState({
        generatedSchedules: [],
        generatingSchedules: null
      });
      resolve();
      return;
    }
    getValidSchedules(
      getState,
      generationStatus => {
        setState({
          generationStatus
        });
      },
      generatedSchedules => {
        setState({
          generatedSchedules,
          generatingSchedules: null
        });
        resolve();
      }
    );
  });
}
