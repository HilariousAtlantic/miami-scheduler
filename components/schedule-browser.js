import React, { Component } from 'react';
import styled from 'styled-components';

import { StoreConsumer } from '../store';

const SchedulerBrowserWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
`;

const ButtonGroup = styled.div`
  button + button {
    margin-left: 8px;
  }
`;

const Button = styled.button`
  background: #fff;
  border: none;
  color: #4a4a4a;
  padding: 8px 24px;
  font-size: 14px;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);
`;

const Label = styled.span`
  background: #fff;
  color: #4a4a4a;
  padding: 8px 32px;
  font-size: 14px;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);
  margin: 0 8px;
`;

export function ScheduleBrowser(props) {
  return (
    <StoreConsumer>
      {(state, actions) => (
        <SchedulerBrowserWrapper>
          <ButtonGroup>
            <Button>Show Filters</Button>
          </ButtonGroup>
          <div>
            <Button onClick={() => actions.prevSchedule()}>
              <i className="fa fa-long-arrow-alt-left" />
            </Button>
            <Label>
              {state.currentSchedule + 1} of {state.generatedSchedules.length}
            </Label>
            <Button onClick={() => actions.nextSchedule()}>
              <i className="fa fa-long-arrow-alt-right" />
            </Button>
          </div>
        </SchedulerBrowserWrapper>
      )}
    </StoreConsumer>
  );
}
