import React, { Component } from 'react';
import styled from 'styled-components';

import { StoreConsumer } from '../store';
import { InlineSelector } from './selector';
import { TimeInput, NumberInput, Checkbox } from './input';
import { DayPicker, IconButton } from './button';

const ScheduleFiltersWrapper = styled.div`
  grid-area: schedule-filters;
`;

const FilterWrapper = styled.div`
  display: flex;
  font-size: 12px;
  align-items: center;

  > * + * {
    margin-left: 8px;
  }
`;

const FilterList = styled.div`
  padding: 16px;
  background: #fff;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);
  margin-bottom: 8px;

  ${FilterWrapper} + ${FilterWrapper} {
    margin-top: 16px;
  }
`;

const FilterOptions = styled.div`
  button + button {
    margin-left: 8px;
  }
`;

const filterComponents = {
  class_time: ({ operator, time, days }, onDelete) => (
    <FilterWrapper>
      <IconButton leftIcon="trash" danger onClick={onDelete} />
      <span>I want to</span>
      <TimeOperatorSelector selectedOption={operator} />
      <TimeInput placeholder="10:00 AM" defaultValue={time} />
      <span>on</span>
      <DayPicker selectedDays={days} />
    </FilterWrapper>
  ),
  class_load: ({ operator, amount, days }, onDelete) => (
    <FilterWrapper>
      <IconButton leftIcon="trash" danger onClick={onDelete} />
      <span>I want</span>
      <AmountOperatorSelector selectedOption={operator} />
      <NumberInput placeholder="3" defaultValue={amount} />
      <span>classes on</span>
      <DayPicker selectedDays={days} />
    </FilterWrapper>
  ),
  break_time: ({ from, until, days }, onDelete) => (
    <FilterWrapper>
      <IconButton leftIcon="trash" danger onClick={onDelete} />
      <span>I want a break from</span>
      <TimeInput placeholder="10:00 AM" defaultValue={from} />
      <span>until</span>
      <TimeInput placeholder="12:00 PM" defaultValue={until} />
      <span>on</span>
      <DayPicker selectedDays={days} />
    </FilterWrapper>
  )
};

function FilterTypeSelector(props) {
  return (
    <InlineSelector
      {...props}
      options={[
        { value: 'filter_type', name: 'Filter Type' },
        { value: 'class_time', name: 'Class Time' },
        { value: 'break_time', name: 'Break Time' },
        { value: 'class_load', name: 'Class Load' }
      ]}
    />
  );
}

function TimeOperatorSelector(props) {
  return (
    <InlineSelector
      {...props}
      options={[
        { value: 'start_before', name: 'start before' },
        { value: 'start_at', name: 'start at' },
        { value: 'start_after', name: 'start after' },
        { value: 'finish_before', name: 'finish before' },
        { value: 'finish_at', name: 'finish at' },
        { value: 'finish_after', name: 'finish after' }
      ]}
    />
  );
}

function AmountOperatorSelector(props) {
  return (
    <InlineSelector
      options={[
        { value: 'less_than', name: 'less than' },
        { value: 'at_most', name: 'at most' },
        { value: 'exactly', name: 'exactly' },
        { value: 'at least', name: 'at least' },
        { value: 'more than', name: 'more than' }
      ]}
    />
  );
}

function ScheduleFilters({ filters, onCreateFilter, onDeleteFilter }) {
  return (
    <ScheduleFiltersWrapper>
      <FilterList>
        {filters.map(({ id, type, ...filter }) =>
          filterComponents[type](filter, () => onDeleteFilter(id))
        )}
      </FilterList>
      <FilterOptions>
        <IconButton
          leftIcon="plus"
          large
          raised
          onClick={() => onCreateFilter('class_time')}
        >
          Class Time Filter
        </IconButton>
        <IconButton
          leftIcon="plus"
          large
          raised
          onClick={() => onCreateFilter('class_load')}
        >
          Class Load Filter
        </IconButton>
        <IconButton
          leftIcon="plus"
          large
          raised
          onClick={() => onCreateFilter('break_time')}
        >
          Break Time Filter
        </IconButton>
      </FilterOptions>
    </ScheduleFiltersWrapper>
  );
}

export function ScheduleFiltersContainer() {
  return (
    <StoreConsumer>
      {(state, actions) => (
        <ScheduleFilters
          filters={state.scheduleFilters}
          onCreateFilter={type => actions.createFilter(type)}
          onDeleteFilter={id => actions.deleteFilter(id)}
        />
      )}
    </StoreConsumer>
  );
}
