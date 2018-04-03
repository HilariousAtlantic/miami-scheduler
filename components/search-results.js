import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import { StoreConsumer } from '../store';

const SearchResultsWrapper = styled.div`
  grid-area: search-results;
  display: flex;
`;

const List = styled.ul`
  flex: 4;
  font-size: 12px;
  overflow-y: scroll;
  background: #ffffff;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);
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

const Expanded = styled.div`
  flex: 3;
  padding: 16px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);
  margin-left: 8px;

  h3 {
    margin-top: 0;
    font-size: 16px;
    font-weight: 500;
  }

  p {
    font-size: 12px;
    line-height: 1.6;
  }
`;

class SearchResults extends Component {
  state = {
    expandedCourse: null
  };

  componentWillReceiveProps({ searchResults }) {
    this.setState({
      expandedCourse: searchResults[0]
    });
  }

  handleFocus = course => {
    this.setState({ expandedCourse: course });
  };

  handleSelect = course => {
    const { searchResults } = this.props;
    this.setState({
      expandedCourse: searchResults[searchResults.indexOf(course) + 1]
    });
    this.props.onSelectCourse(course);
  };

  render() {
    const { searchResults, onSelectCourse } = this.props;
    const { expandedCourse } = this.state;
    return (
      <SearchResultsWrapper>
        <List>
          {searchResults.map(course => (
            <ListItem
              key={course.code}
              onClick={() => onSelectCourse(course)}
              onMouseEnter={() => this.handleFocus(course)}
            >
              <span>
                {course.subject} {course.number} - {course.title}
              </span>
            </ListItem>
          ))}
        </List>

        <Expanded>
          {expandedCourse && (
            <Fragment>
              <h3>{expandedCourse.title}</h3>
              <p>{expandedCourse.description}</p>
            </Fragment>
          )}
        </Expanded>
      </SearchResultsWrapper>
    );
  }
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
          onSelectCourse={async course => actions.selectCourse(course.code)}
        />
      )}
    </StoreConsumer>
  );
}
