import React, { Component } from 'react';
import styled from 'styled-components';

import { StoreConsumer } from '../store';

const SearchResultsWrapper = styled.div`
  grid-area: search-results;
`;

const List = styled.ul`
  flex: 1;
  background: #ffffff;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);
  font-size: 12px;
`;

const ListItem = styled.li`
  cursor: pointer;
  list-style: none;
  padding: 16px;

  &:hover {
    background: #f5f5f5f5;
  }
`;

function SearchResults({ searchResults, onSelectCourse, onSearchCourses }) {
  return (
    <SearchResultsWrapper>
      <List>
        {searchResults.slice(0, 5).map(course => (
          <ListItem key={course.code} onClick={() => onSelectCourse(course)}>
            {course.subject} {course.number} - {course.title}
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
          onSelectCourse={course => {
            setTimeout(async () => {
              actions.selectCourse(course);
              await actions.fetchSections(course.code);
              actions.generateSchedules();
            });
          }}
        />
      )}
    </StoreConsumer>
  );
}
