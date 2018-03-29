import React, { Component } from 'react';
import styled from 'styled-components';

import { StoreConsumer } from '../store';

const SearchResultsWrapper = styled.div`
  grid-area: search-results;
  display: flex;
`;

const List = styled.ul`
  flex: 1;
  background: #ffffff;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);
  font-size: 12px;
  overflow-y: scroll;
`;

const ListItem = styled.li`
  cursor: pointer;
  list-style: none;
  padding: 16px;

  &:hover {
    background: #f5f5f5;
  }

  span {
    font-weight: 500;
  }

  p {
    color: #6a6a6a;
    line-height: 1.6;
  }
`;

function SearchResults({ searchResults, onSelectCourse, onSearchCourses }) {
  return (
    <SearchResultsWrapper>
      <List>
        {searchResults.map(course => (
          <ListItem key={course.code} onClick={() => onSelectCourse(course)}>
            <span>
              {course.subject} {course.number} - {course.title}
            </span>
          </ListItem>
        ))}
      </List>
    </SearchResultsWrapper>
  );
}

export function SearchResultsContainer() {
  return (
    <StoreConsumer>
      {(state, actions) => (
        <SearchResults
          searchResults={state.searchedCourses.filter(
            course =>
              !state.selectedCourses.includes(course.code) &&
              !state.loadingCourses.includes(course.code)
          )}
          onSelectCourse={async course => {
            actions.selectCourse(course);
            await actions.fetchSections(course.code);
            actions.generateSchedules();
          }}
        />
      )}
    </StoreConsumer>
  );
}
