import React, { Component } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';

import { StoreConsumer } from '../store';

const CourseSearchWrapper = styled.div`
  position: relative;

  i {
    position: absolute;
    pointer-events: none;
    top: 16px;
    left: 16px;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  box-sizing: border-box;
  font-size: 0.875rem;
  padding: 16px;
  padding-left: 48px;
  color: #4a4a4a;
  background: #ffffff;
  border: none;
  border-radius: 0;
  outline: none;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);

  &:focus {
    box-shadow: 1px 1px 16px rgba(33, 150, 243, 0.5);
  }
`;

function CourseSearch({ onSearchCourses }) {
  const handleSearchCourses = debounce(
    event => onSearchCourses(event.target.value),
    600
  );

  return (
    <CourseSearchWrapper>
      <Input
        placeholder="Search Courses"
        onChange={event => {
          event.persist();
          handleSearchCourses(event);
        }}
      />
      <i className="fa fa-search" />
    </CourseSearchWrapper>
  );
}

export function CourseSearchContainer() {
  return (
    <StoreConsumer>
      {(state, actions) => (
        <CourseSearch
          onSearchCourses={query =>
            actions.searchCourses(state.selectedTerm, query)
          }
        />
      )}
    </StoreConsumer>
  );
}
