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

const MessageWrapper = styled.div`
  flex: 4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);

  h4 {
    margin: 0;
    text-align: center;
    color: #555;
  }
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  text-align: center;

  span {
    color: #4a4a4a;
  }

  em {
    font-size: 14px;
    color: #999;
    margin-top: 4px;
  }
`;

class SearchResults extends Component {
  state = {
    expandedCourse: null
  };

  componentWillReceiveProps({ searchResults }) {
    if (!this.state.expandedCourse) {
      this.setState({
        expandedCourse: searchResults[0]
      });
    } else if (!searchResults.length) {
      this.setState({
        expandedCourse: null
      });
    }
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
        {searchResults.length ? (
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
        ) : (
          <MessageWrapper>
            <h4>No Results</h4>
            <Message>
              <span>Search for courses in subjects</span>
              <em>"ENG", "CSE", "ACC BUS"</em>
            </Message>
            <Message>
              <span>Search for starting course numbers</span>
              <em>"ENG 1", "CSE 27", "BUS 3 4"</em>
            </Message>
            <Message>
              <span>Search for specific courses</span>
              <em>"ENG 111", "CSE 174"</em>
            </Message>
            <Message>
              <span>Search for a keyword in the course title</span>
              <em>"Intro", "History", "Studies"</em>
            </Message>
          </MessageWrapper>
        )}

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
          onSelectCourse={async course => actions.selectCourse(course)}
        />
      )}
    </StoreConsumer>
  );
}
