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
    background: #f5f5f5f5;
  }
`;

function SearchResults({ searchResults, onSelectCourse, onSearchCourses }) {
  return (
    <SearchResultsWrapper>
      <List>
        {searchResults.map(course => (
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
          searchResults={state.searchedCourses}
          onSelectCourse={course => {
            actions.fetchSections(course.code);
            actions.selectCourse(course.code);
          }}
        />
      )}
    </StoreConsumer>
  );
}
