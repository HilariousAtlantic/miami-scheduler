import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { transparentize, darken } from 'polished';

import { StoreConsumer } from '../store';

const days = ['M', 'T', 'W', 'R', 'F'];
const days_detailed = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const schedulesPerPage = {
  detailed: 1,
  compact: 3
};

const colors = [
  '#0D47A1',
  '#B71C1C',
  '#1B5E20',
  '#E65100',
  '#4A148C',
  '#006064',
  '#263238'
];

const ScheduleWrapper = styled.div`
  height: 720px;
  min-width: 400px;
  max-width: 960px;
  flex: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);

  + div {
    margin-left: 16px;
  }
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

const ScheduleFooter = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
  color: #4a4a4a;
  background: #f5f5f5;
  padding: 16px;

  .fa-download {
    margin-right: 4px;
  }
`;

const ScheduleMeet = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(20% - 4px);
  position: absolute;
  box-sizing: border-box;
  color: #fff;
  padding: 4px;
  font-size: 10px;
  font-weight: 400;

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

const ScheduleListWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

function toTime(minutes) {
  const h = Math.floor((minutes / 60) % 12);
  const m = Math.floor(minutes % 60);
  return `${h || 12}:${('00' + m).slice(-2)}`;
}

export function Schedule({ courses, crns, detailed }) {
  const schedule_start = 450;
  const schedule_end = 1230;
  const schedule_length = schedule_end - schedule_start;
  const meets = courses.reduce(
    (acc, course, i) => [
      ...acc,
      ...course.meets.reduce(
        (acc, meet) => [
          ...acc,
          ...meet.days.map((day, j) => (
            <ScheduleMeet
              key={course.crn + day + j}
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
                {detailed && meet.location}
              </span>
              {detailed && <span>{course.instructor}</span>}
              {detailed && (
                <div className="slots">
                  <span>{course.slots} Seats</span>
                </div>
              )}
            </ScheduleMeet>
          ))
        ],
        []
      )
    ],
    []
  );

  return (
    <ScheduleWrapper detailed={detailed}>
      <ScheduleHeader>
        {(detailed ? days_detailed : days).map(day => (
          <span key={day}>{day}</span>
        ))}
      </ScheduleHeader>
      <ScheduleCalendar>{meets}</ScheduleCalendar>
      <ScheduleFooter>
        <span>
          <i className="fa fa-download" /> {detailed && 'Download as image'}
        </span>
        <span>{crns.join(', ')}</span>
      </ScheduleFooter>
    </ScheduleWrapper>
  );
}

function getSchedules(state) {
  const index = state.currentSchedule * schedulesPerPage[state.scheduleView];
  return state.generatedSchedules
    .slice(index, index + schedulesPerPage[state.scheduleView])
    .map(schedule =>
      schedule.reduce(
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
      )
    );
}

function ScheduleList({ schedules, view }) {
  return (
    <ScheduleListWrapper>
      {schedules.map(schedule => (
        <Schedule
          key={schedule.crns.join(',')}
          detailed={view === 'detailed'}
          {...schedule}
        />
      ))}
    </ScheduleListWrapper>
  );
}

export function ScheduleListContainer() {
  return (
    <StoreConsumer>
      {(state, actions) => {
        return (
          <ScheduleList
            schedules={getSchedules(state)}
            view={state.scheduleView}
          />
        );
      }}
    </StoreConsumer>
  );
}
