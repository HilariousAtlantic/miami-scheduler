import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import { StoreConsumer } from '../store';
import { IconButton } from './button';
import { Selector } from './selector';

const ScheduleToolbarWrapper = styled.div`
  grid-area: schedule-toolbar;
  display: flex;
  justify-content: space-between;
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
  padding: 16px 32px;
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
  padding: 16px 0;
  background: #ffffff;
  font-size: 12px;
  text-align: center;
`;

function ScheduleToolbar({ browserText, onPrevSchedule, onNextSchedule }) {
  return (
    <ScheduleToolbarWrapper>
      <ScheduleOptions>
        <Selector
          label="View"
          options={[
            { name: 'Detailed', value: 'detailed' },
            { name: 'Compact', value: 'compact' }
          ]}
        />
        <Selector
          label="Sort"
          options={[
            { name: 'Early Start', value: 'start_time_asc' },
            { name: 'Late Start', value: 'start_time_desc' },
            { name: 'Early Finish', value: 'finish_time_asc' },
            { name: 'Late Finish', value: 'finish_time_desc' }
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
      state.generatedSchedules.length / state.schedulesPerPage
    );
    return `${page} of ${pages}`;
  };

  return (
    <StoreConsumer>
      {(state, actions) => (
        <ScheduleToolbar
          browserText={text(state)}
          onPrevSchedule={() => actions.prevSchedule()}
          onNextSchedule={() => actions.nextSchedule()}
        />
      )}
    </StoreConsumer>
  );
}
