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
  height: 85vh;
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

  .crn {
    position: absolute;
    bottom: 4px;
    right: 4px;
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

const OnlineSection = styled.div`
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

  .crn {
    position: absolute;
    bottom: 4px;
    right: 4px;
  }

  ${props => `
    top: 0;
    bottom: 0;
    border-left: 4px solid ${props.color};
    color: ${darken(0.2, props.color)};
    background: ${transparentize(0.8, props.color)};
    left: ${props.column * 20}%;
    opacity: ${props.full ? 0.5 : 1};
  `};
`;

const ScheduleFooter = styled.div`
  height: 48px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #6a6a6a;
  font-size: 12px;
  box-shadow: -2px -2px 8px rgba(255, 255, 255, 0.2);
`;

const ScheduleList = styled.div`
  position: relative;
`;

const BrowserButton = styled.button`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  color: #6a6a6a;
  border: none;
  background: transparent;
  top: 50%;
  transform: translateY(-50%);
  outline: none;
  cursor: pointer;
  ${props => (props.prev ? 'left: -88px;' : 'right: -88px;')};

  span {
    line-height: 32px;
    font-size: 12px;
    font-weight: 600;
  }

  &:hover {
    color: #4a4a4a;
  }
`;

function toTime(minutes) {
  const h = Math.floor((minutes / 60) % 12);
  const m = Math.floor(minutes % 60);
  return `${h || 12}:${('00' + m).slice(-2)}`;
}

export function Schedule({
  courses,
  credits,
  crns,
  events,
  onlines,
  unknowns
}) {
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
          <ScheduleMeet
            key={i}
            color={colors[crns.indexOf(event.crn)] || '#4a4a4a'}
            column={'MTWRF'.indexOf(event.day)}
            start={(event.start - schedule_start) / schedule_length}
            length={(event.end - event.start) / schedule_length}
            full={event.slots <= 0}
          >
            <span className="course-name">{event.name}</span>
            <span>
              {toTime(event.start)} - {toTime(event.end)} {event.location}
            </span>
            <span>{event.instructor}</span>
            <div className="slots">
              <span>{event.slots} Seats</span>
            </div>
            <div className="crn">
              <span>{event.crn}</span>
            </div>
          </ScheduleMeet>
        ))}
      </ScheduleCalendar>
      {onlines.length + unknowns.length > 0 && (
        <ScheduleFooter>
          <Fragment>
            {onlines.map((online, i) => (
              <OnlineSection
                key={i}
                color={colors[crns.indexOf(online.crn)] || '#4a4a4a'}
                column={i}
                full={online.slots <= 0}
              >
                <span className="course-name">{online.name}</span>
                <span>Online</span>
                <span>{online.instructor}</span>
                <div className="slots">
                  <span>{online.slots} Seats</span>
                </div>
                <div className="crn">
                  <span>{online.crn}</span>
                </div>
              </OnlineSection>
            ))}
            {unknowns.map((online, i) => (
              <OnlineSection
                key={i}
                color={colors[crns.indexOf(online.crn)] || '#4a4a4a'}
                column={i + onlines.length}
                full={online.slots <= 0}
              >
                <span className="course-name">{online.name}</span>
                <span>TBA</span>
                <span>{online.instructor}</span>
                <div className="slots">
                  <span>{online.slots} Seats</span>
                </div>
                <div className="crn">
                  <span>{online.crn}</span>
                </div>
              </OnlineSection>
            ))}
          </Fragment>
        </ScheduleFooter>
      )}
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
            <Schedule {...schedule} />
            <SectionList
              sections={schedule.sections}
              lockedSections={state.lockedSections}
              onSelectSection={section =>
                actions.toggleLockedSection(section.crn)
              }
            />
          </ScheduleList>
        );
      }}
    </StoreConsumer>
  );
}
