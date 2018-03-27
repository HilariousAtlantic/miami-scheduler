import React, { Component } from 'react';
import styled from 'styled-components';

import { StoreProvider, withStore } from '../store';
import {
  TermSelectorContainer,
  CourseSearchContainer,
  SearchResultsContainer,
  SelectedCoursesContainer
} from '../components';

const Container = styled.div`
  width: 90%;
  max-width: 800px;
  margin: 20px auto;
`;

const CourseBrowser = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: auto 200px;
  grid-template-rows: 32px 48px 320px;
  grid-template-areas:
    'selected-courses selected-courses'
    'course-search term-selector'
    'search-results search-results';

  .course-search {
    grid-area: course-search;
  }

  .term-selector {
    grid-area: term-selector;
  }

  .search-results {
    display: flex;
    grid-area: search-results;
  }

  .selected-courses {
    display: flex;
    grid-area: selected-courses;
  }
`;

class Test extends Component {
  componentWillMount() {
    const { actions } = this.props.store;
    actions.fetchTerms();
  }

  render() {
    return (
      <Container>
        <CourseBrowser>
          <div className="course-search">
            <CourseSearchContainer />
          </div>
          <div className="term-selector">
            <TermSelectorContainer />
          </div>
          <div className="search-results">
            <SearchResultsContainer />
          </div>
          <div className="selected-courses">
            <SelectedCoursesContainer />
          </div>
        </CourseBrowser>
      </Container>
    );
  }
}

const TestWithStore = withStore(Test);

export default class extends Component {
  render() {
    return <StoreProvider>{() => <TestWithStore />}</StoreProvider>;
  }
}
