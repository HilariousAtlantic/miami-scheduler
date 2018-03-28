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

const ScheduleGrid = styled.div`
  display: grid;
  grid-auto-rows: 80vh;
  grid-gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
`;

const ScheduleWrapper = styled.div`
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
`;

const ScheduleMeet = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(20% - 4px);
  position: absolute;
  color: #fff;
  font-size: 10px;
  font-weight: 500;
  padding: 4px;
  box-sizing: border-box;

  span + span {
    margin-top: 2px;
  }

  .slots {
    font-weight: 400;
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

const CourseNumbers = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #4a4a4a;
`;

function toTime(minutes) {
  const h = Math.floor((minutes / 60) % 12);
  const m = Math.floor(minutes % 60);
  return `${h || 12}:${('00' + m).slice(-2)}`;
}

function Schedule({ courses, crns }) {
  const schedule_start = 420;
  const schedule_end = 1200;
  const schedule_length = schedule_end - schedule_start;
  const meets = courses.reduce(
    (acc, course, i) => [
      ...acc,
      ...course.meets.reduce(
        (acc, meet) => [
          ...acc,
          ...meet.days.map(day => (
            <ScheduleMeet
              color={colors[i] || '#4a4a4a'}
              column={days.indexOf(day)}
              start={(meet.start_time - schedule_start) / schedule_length}
              length={(meet.end_time - meet.start_time) / schedule_length}
            >
              <span>
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

  return (
    <ScheduleWrapper>
      <ScheduleHeader>
        <span>Monday</span>
        <span>Tuesday</span>
        <span>Wednesday</span>
        <span>Thursday</span>
        <span>Friday</span>
      </ScheduleHeader>
      <ScheduleCalendar>
        {meets}
        <CourseNumbers>{crns.join(', ')}</CourseNumbers>
      </ScheduleCalendar>
    </ScheduleWrapper>
  );
}

function GeneratedSchedules({ schedules }) {
  return (
    <GeneratedSchedulesWrapper>
      <ScheduleGrid>
        {schedules.map(schedule => <Schedule {...schedule} />)}
      </ScheduleGrid>
    </GeneratedSchedulesWrapper>
  );
}

export function GeneratedSchedulesContainer() {
  return (
    <StoreConsumer>
      {(state, actions) => (
        <GeneratedSchedules
          schedules={state.generatedSchedules.map(schedule => {
            return {
              crns: schedule.map(s => s.crn),
              courses: schedule.map(s => {
                return {
                  ...state.coursesByCode[s.code],
                  ...state.sectionsByCrn[s.crn]
                };
              })
            };
          })}
        />
      )}
    </StoreConsumer>
  );
}
