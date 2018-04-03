import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import { StoreConsumer } from '../store';
import { Selector } from './selector';

const schedulesPerPage = {
  detailed: 1,
  compact: 3
};

const ScheduleToolbarWrapper = styled.div`
  grid-area: schedule-toolbar;
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ScheduleOptions = styled.div`
  display: flex;

  div + div {
    margin-left: 8px;
  }
`;

const ScheduleBrowser = styled.div`
  background: #ffffff;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);
`;

const BrowserButton = styled.button`
  background: #ffffff;
  border: none;
  outline: none;
  color: #4a4a4a;
  font-size: 12px;
  padding: 12px 32px;
  cursor: pointer;

  &:hover {
    background: #fafafa;
  }

  &:active {
    background: #f5f5f5;
  }
`;

const BrowserLabel = styled.label`
  display: inline-block;
  width: 80px;
  padding: 12px 0;
  background: #ffffff;
  font-size: 12px;
  text-align: center;
`;

function ScheduleToolbar({
  browserText,
  scheduleView,
  scheduleSort,
  onSelectView,
  onSelectSort,
  onPrevSchedule,
  onNextSchedule
}) {
  return (
    <ScheduleToolbarWrapper>
      <ScheduleOptions>
        <Selector
          label="View"
          selectedOption={scheduleView}
          onSelectOption={onSelectView}
          options={[
            { name: 'Detailed', value: 'detailed' },
            { name: 'Compact', value: 'compact' }
          ]}
        />
        <Selector
          label="Sort"
          selectedOption={scheduleSort}
          onSelectOption={onSelectSort}
          options={[
            { name: 'Early Classes', value: 'start_time_asc' },
            { name: 'Late Classes', value: 'start_time_desc' }
          ]}
        />
      </ScheduleOptions>
      <ScheduleBrowser>
        <BrowserButton onClick={onPrevSchedule}>
          <i className="fa fa-angle-left" />
        </BrowserButton>
        <BrowserLabel>{browserText}</BrowserLabel>
        <BrowserButton onClick={onNextSchedule}>
          <i className="fa fa-angle-right" />
        </BrowserButton>
      </ScheduleBrowser>
    </ScheduleToolbarWrapper>
  );
}

export function ScheduleToolbarContainer() {
  const text = state => {
    const page = state.currentSchedule + 1;
    const pages = Math.ceil(
      state.generatedSchedules.length / schedulesPerPage[state.scheduleView]
    );
    return `${page} of ${pages}`;
  };

  return (
    <StoreConsumer>
      {(state, actions) => (
        <ScheduleToolbar
          browserText={text(state)}
          scheduleView={state.scheduleView}
          scheduleSort={state.scheduleSort}
          onSelectView={view => actions.selectScheduleView(view)}
          onSelectSort={sort => actions.selectScheduleSort(sort)}
          onPrevSchedule={() => actions.prevSchedule()}
          onNextSchedule={() => actions.nextSchedule()}
        />
      )}
    </StoreConsumer>
  );
}
