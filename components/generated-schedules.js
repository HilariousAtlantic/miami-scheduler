import React, { Component } from 'react';
import styled from 'styled-components';

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
  padding: 32px;
`;

const ScheduleGrid = styled.div`
  display: grid;
  grid-auto-rows: 75vh;
  grid-gap: 8px;
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
  justify-content: space-around;
  padding: 16px 0;
  background: #37474f;
  color: #fff;
  font-size: 12px;
`;

const ScheduleCalendar = styled.div`
  flex: 1;
  position: relative;
`;

const ScheduleMeet = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(20% - 2px);
  position: absolute;
  color: #fff;
  font-size: 10px;
  padding: 4px;
  box-sizing: border-box;

  span + span {
    margin-top: 4px;
  }

  ${props => `
    top: ${props.start * 100}%;
    height: ${props.length * 100}%;
    background: ${props.color || '#4a4a4a'};
    left: calc(${props.column * 20}% + 1px);
  `};
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
              color={colors[i]}
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
      <ScheduleHeader>{days.map(day => <span>{day}</span>)}</ScheduleHeader>
      <ScheduleCalendar>{meets}</ScheduleCalendar>
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
