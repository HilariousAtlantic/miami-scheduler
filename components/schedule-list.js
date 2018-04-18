import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { transparentize, darken } from 'polished';

import { StoreConsumer } from '../store';
import { SectionList } from './section-list';

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
  width: 100%;
  height: 700px;
  flex: 1;
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

const ScheduleEvent = styled.div`
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

  .seats {
    position: absolute;
    top: 4px;
    right: 4px;
  }

  @media screen and (max-width: 480px) {
    .seats {
      display: none;
    }
  }

  ${props => `
    top: ${props.start * 100}%;
    height: ${props.length * 100}%;
    border-left: 4px solid ${props.color};
    color: ${darken(0.2, props.color)};
    background: ${transparentize(0.8, props.color)};
    left: ${props.column * 20}%;
    opacity: ${props.full ? 0.5 : 1};
  `};
`;

const ScheduleFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background: #fafafa;
  color: #4a4a4a;
  font-size: 12px;
  font-weight: 500;
`;

const ScheduleList = styled.div`
  position: relative;
`;

const BrowserButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  color: #4a4a4a;
  opacity: 0.75;
  transition: opacity 100ms ease-in;
  border: none;
  background: transparent;
  outline: none;
  cursor: pointer;
  position: absolute;
  top: calc(50% - 48px);
  ${props => (props.prev ? 'left: -80px;' : 'right: -80px;')};

  span {
    line-height: 32px;
    font-size: 12px;
    font-weight: 600;
  }

  &:hover {
    opacity: 1;
  }

  @media screen and (max-width: 1096px) {
    opacity: 0.25;
    top: 64px;
    ${props => (props.prev ? 'left: 16px;' : 'right: 16px;')};
  }
`;

function toTime(minutes) {
  const h = Math.floor((minutes / 60) % 12);
  const m = Math.floor(minutes % 60);
  return `${h || 12}:${('00' + m).slice(-2)}`;
}

export function Schedule({ credits, crns, events, onlines }) {
  const schedule_start = 450;
  const schedule_end = 1230;
  const schedule_length = schedule_end - schedule_start;

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
        {events.map((event, i) => (
          <ScheduleEvent
            key={i}
            color={colors[crns.indexOf(event.crn)] || '#4a4a4a'}
            column={'MTWRF'.indexOf(event.day)}
            start={(event.start - schedule_start) / schedule_length}
            length={(event.end - event.start) / schedule_length}
            full={event.seats <= 0}
          >
            <span className="course-name">{event.name}</span>
            <span>
              {toTime(event.start)} - {toTime(event.end)} {event.location}
            </span>
            <span>{event.instructor}</span>
            <div className="seats">
              <span>{event.seats} Seats</span>
            </div>
          </ScheduleEvent>
        ))}
        {onlines.map((event, i) => (
          <ScheduleEvent
            key={events.length + i}
            color={colors[crns.indexOf(event.crn)] || '#4a4a4a'}
            column={i}
            start={0}
            length={55 / schedule_length}
            full={event.seats <= 0}
          >
            <span className="course-name">{event.name}</span>
            <span>{event.hybrid && 'Hybrid '}Online</span>
            <span>{event.instructor}</span>
            <div className="seats">
              <span>{event.seats} Seats</span>
            </div>
          </ScheduleEvent>
        ))}
      </ScheduleCalendar>
      <ScheduleFooter>
        <span>{crns.join(', ')}</span>
        <span>{credits} Credits</span>
      </ScheduleFooter>
    </ScheduleWrapper>
  );
}

export function ScheduleListContainer() {
  return (
    <StoreConsumer>
      {(state, actions) => {
        const schedules = state.filteredSchedules.filter(schedule =>
          state.lockedSections.every(crn => schedule.crns.includes(crn))
        );
        const index = state.currentSchedule;
        const schedule = schedules[index];
        return (
          <ScheduleList>
            <Schedule {...schedule} />
            <SectionList
              sections={schedule.sections}
              lockedSections={state.lockedSections}
              onSelectSection={section =>
                actions.toggleLockedSection(section.crn)
              }
            />
            {index > 0 && (
              <BrowserButton prev onClick={() => actions.prevSchedule()}>
                <i className="fa fa-arrow-alt-circle-left" />
                <span>
                  {index} of {schedules.length}
                </span>
              </BrowserButton>
            )}
            {index < schedules.length - 1 && (
              <BrowserButton onClick={() => actions.nextSchedule()}>
                <i className="fa fa-arrow-alt-circle-right" />
                <span>
                  {index + 2} of {schedules.length}
                </span>
              </BrowserButton>
            )}
          </ScheduleList>
        );
      }}
    </StoreConsumer>
  );
}
