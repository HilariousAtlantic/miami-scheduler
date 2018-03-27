import React, { Component } from 'react';
import styled from 'styled-components';

import { StoreProvider, withStore } from '../store';
import {
  TermSelectorContainer,
  CourseSearchContainer,
  SearchResultsContainer,
  SelectedCoursesContainer
} from '../components';

const CourseSelection = styled.div`
  width: 90%;
  max-width: 800px;
  margin: 20px auto;
  display: grid;
  grid-gap: 8px;
  grid-template-columns: auto 200px;
  grid-template-rows: 32px 48px 320px;
  grid-template-areas:
    'selected-courses selected-courses'
    'course-search term-selector'
    'search-results search-results';
`;

const ScheduleGenerator = withStore(
  class extends Component {
    componentWillMount() {
      const { actions } = this.props.store;
      actions.fetchTerms();
    }

    render() {
      return (
        <CourseSelection>
          <CourseSearchContainer />
          <TermSelectorContainer />
          <SearchResultsContainer />
          <SelectedCoursesContainer />
        </CourseSelection>
      );
    }
  }
);

export default function() {
  return <StoreProvider>{() => <ScheduleGenerator />}</StoreProvider>;
}
