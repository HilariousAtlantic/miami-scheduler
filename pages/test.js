import React, { Component } from 'react';
import styled from 'styled-components';

import { StoreProvider, withStore } from '../store';
import {
  TermSelectorContainer,
  CourseSearchContainer,
  SearchResultsContainer,
  SelectedCoursesContainer
} from '../components';

const ScheduleGeneratorWrapper = styled.div``;

const Navbar = styled.header`
  width: 90%;
  max-width: 800px;
  margin: 32px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled.h1`
  font-weight: 400;
  font-size: 24px;
`;

const Links = styled.nav`
  font-size: 14px;

  a {
    color: #4a4a4a;
    text-decoration: none;
  }
`;

const CourseSelection = styled.div`
  width: 90%;
  max-width: 800px;
  margin: 16px auto;
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
        <ScheduleGeneratorWrapper>
          <Navbar>
            <Brand>Miami Scheduler</Brand>
            <Links>
              <a href="/feedback">Send Feedback</a>
            </Links>
          </Navbar>

          <CourseSelection>
            <CourseSearchContainer />
            <TermSelectorContainer />
            <SearchResultsContainer />
            <SelectedCoursesContainer />
          </CourseSelection>
        </ScheduleGeneratorWrapper>
      );
    }
  }
);

export default function() {
  return <StoreProvider>{() => <ScheduleGenerator />}</StoreProvider>;
}
