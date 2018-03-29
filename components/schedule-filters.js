import React, { Component } from 'react';
import styled from 'styled-components';

import { StoreConsumer } from '../store';
import { Selector } from './selector';
import { TimeInput, NumberInput } from './input';
import { DayPicker, IconButton } from './button';

const ScheduleFiltersWrapper = styled.div`
  margin: 16px 0;

  td {
    padding: 16px;
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  font-size: 12px;
  margin-bottom: 8px;

  > * + * {
    margin-left: 8px;
  }
`;

const FilterSection = styled.section`
  display: flex;
  align-items: center;
  padding: 0 8px;
  background: #fff;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);

  > * + * {
    margin-left: 8px;
  }
`;

const FilterSelectorWrapper = styled.div`
  border-bottom: 2px solid #4a4a4a;
`;

function FilterTypeSelector(props) {
  return (
    <Selector
      {...props}
      options={[
        { value: 'filter_typ', name: 'Filter Type' },
        { value: 'class_time', name: 'Class Time' },
        { value: 'class_load', name: 'Class Load' }
      ]}
    />
  );
}

function TimeOperatorSelector(props) {
  return (
    <FilterSelectorWrapper>
      <Selector
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
    </FilterSelectorWrapper>
  );
}

function AmountOperatorSelector(props) {
  return (
    <FilterSelectorWrapper>
      <Selector
        options={[
          { value: 'less_than', name: 'less than' },
          { value: 'at_most', name: 'at most' },
          { value: 'exactly', name: 'exactly' },
          { value: 'at least', name: 'at least' },
          { value: 'more than', name: 'more than' }
        ]}
      />
    </FilterSelectorWrapper>
  );
}

function ScheduleFilters(props) {
  return (
    <ScheduleFiltersWrapper>
      <FilterWrapper>
        <IconButton leftIcon="trash" danger raised />
        <FilterSection>
          <FilterTypeSelector selectedOption="class_time" />
        </FilterSection>
        <FilterSection>
          <span>I want to</span>
          <TimeOperatorSelector />
          <TimeInput placeholder="10:00 AM" />
          <span>on</span>
          <DayPicker selectedDays={['M', 'W', 'F']} />
        </FilterSection>
      </FilterWrapper>
      <FilterWrapper>
        <IconButton leftIcon="trash" danger raised />
        <FilterSection>
          <FilterTypeSelector selectedOption="class_load" />
        </FilterSection>
        <FilterSection>
          <span>I want</span>
          <AmountOperatorSelector />
          <NumberInput placeholder="3" />
          <span>classes on</span>
          <DayPicker selectedDays={['T', 'R']} />
        </FilterSection>
      </FilterWrapper>
      <FilterWrapper>
        <IconButton leftIcon="trash" danger raised />
        <FilterSection>
          <FilterTypeSelector />
        </FilterSection>
      </FilterWrapper>
      <IconButton leftIcon="plus" raised>
        Add Filter
      </IconButton>
    </ScheduleFiltersWrapper>
  );
}

export function ScheduleFiltersContainer() {
  return (
    <StoreConsumer>{(state, actions) => <ScheduleFilters />}</StoreConsumer>
  );
}
