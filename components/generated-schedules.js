import React, { Component } from 'react';
import styled from 'styled-components';
import { transparentize, darken } from 'polished';

import { StoreConsumer } from '../store';

const days = ['M', 'T', 'W', 'R', 'F'];

const colors = [
  '#0D47A1',
  '#B71C1C',
  '#1B5E20',
  '#E65100',
  '#4A148C',
  '#006064',
  '#263238'
];

const GeneratedSchedulesWrapper = styled.div`
  grid-area: generated-schedules;
`;

const ScheduleWrapper = styled.div`
  height: 85vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);
`;

const ScheduleHeader = styled.div`
  display: flex;
  padding: 16px 0;
  background: #37474f;
  color: #fff;
  font-size: 12px;
  text-align: center;

  span {
    flex: 1;
  }
`;

const ScheduleCalendar = styled.div`
  flex: 1;
  position: relative;
  overflow-y: scroll;
`;

const ScheduleMeet = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(20% - 4px);
  position: absolute;
  color: #fff;
  font-size: 10px;
  font-weight: 400;
  padding: 4px;
  box-sizing: border-box;

  .course-name {
    font-weight: 900;
  }

  span + span {
    margin-top: 2px;
  }

  .slots {
    position: absolute;
    top: 4px;
    right: 4px;
  }

  ${props => `
    top: ${props.start * 100}%;
    height: ${props.length * 100}%;
    border-left: 4px solid ${props.color};
    color: ${darken(0.2, props.color)};
    background: ${transparentize(0.8, props.color)};
    left: ${props.column * 20}%;
  `};
`;

const ScheduleFooter = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
  color: #4a4a4a;
  background: #f5f5f5;
  padding: 16px;
`;

function toTime(minutes) {
  const h = Math.floor((minutes / 60) % 12);
  const m = Math.floor(minutes % 60);
  return `${h || 12}:${('00' + m).slice(-2)}`;
}

function Schedule({ courses, crns }) {
  const schedule_start = 450;
  const schedule_end = 1170;
  const schedule_length = schedule_end - schedule_start;
  const meets = courses.reduce(
    (acc, course, i) => [
      ...acc,
      ...course.meets.reduce(
        (acc, meet) => [
          ...acc,
          ...meet.days.map(day => (
            <ScheduleMeet
              key={course.crn + day}
              color={colors[i] || '#4a4a4a'}
              column={days.indexOf(day)}
              start={(meet.start_time - schedule_start) / schedule_length}
              length={(meet.end_time - meet.start_time) / schedule_length}
            >
              <span className="course-name">
                {course.subject} {course.number} {course.name}
              </span>
              <span>
                {toTime(meet.start_time)} - {toTime(meet.end_time)}{' '}
                {meet.location}
              </span>
              <span>{course.instructor}</span>
              <div className="slots">
                <span>{course.slots} Seats</span>
              </div>
            </ScheduleMeet>
          ))
        ],
        []
      )
    ],
    []
  );

  const credits = [
    ...new Set(
      courses.reduce(
        ([totalLow, totalHigh], course) => [
          totalLow + course.credits[0],
          totalHigh + (course.credits[1] || course.credits[0])
        ],
        [0, 0]
      )
    )
  ];

  return (
    <ScheduleWrapper>
      <ScheduleHeader>
        <span>Monday</span>
        <span>Tuesday</span>
        <span>Wednesday</span>
        <span>Thursday</span>
        <span>Friday</span>
      </ScheduleHeader>
      <ScheduleCalendar>{meets}</ScheduleCalendar>
      <ScheduleFooter>
        <span>{crns.join(', ')}</span>
        <span>{credits.join('-')} Credits</span>
      </ScheduleFooter>
    </ScheduleWrapper>
  );
}

function GeneratedSchedules({ schedule }) {
  return (
    <GeneratedSchedulesWrapper>
      <Schedule {...schedule} />
    </GeneratedSchedulesWrapper>
  );
}

export function GeneratedSchedulesContainer() {
  const getSchedule = state =>
    state.generatedSchedules[state.currentSchedule].reduce(
      ({ crns, courses, start_time, end_time }, { code, crn }) => {
        const course = state.coursesByCode[code];
        const section = state.sectionsByCrn[crn];

        return {
          crns: [...crns, crn],
          courses: [
            ...courses,
            {
              ...course,
              ...section
            }
          ],
          start_time: Math.min(
            start_time,
            ...section.meets.map(meet => meet.start_time)
          ),
          end_time: Math.max(
            end_time,
            ...section.meets.map(meet => meet.end_time)
          )
        };
      },
      { crns: [], courses: [], start_time: 1440, end_time: 0 }
    );
  return (
    <StoreConsumer>
      {(state, actions) => {
        return (
          state.generatedSchedules.length > 0 && (
            <GeneratedSchedules schedule={getSchedule(state)} />
          )
        );
      }}
    </StoreConsumer>
  );
}
