import React, { Component } from 'react';
import styled from 'styled-components';

import { StoreProvider, withStore } from '../store';
import {
  GeneratedSchedulesContainer,
  TermSelectorContainer,
  CourseSearchContainer,
  SearchResultsContainer,
  SelectedCoursesContainer
} from '../components';

const ScheduleGeneratorWrapper = styled.div`
  width: 90%;
  max-width: 960px;
  margin: 32px auto;
`;

const Navbar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const Brand = styled.a`
  color: #4a4a4a;
  text-decoration: none;
  font-weight: 400;
  font-size: 24px;
`;

const Links = styled.nav`
  font-size: 14px;

  a {
    color: #4a4a4a;
    text-decoration: none;
    padding: 8px 0;

    &.active {
      border-bottom: 2px solid rgb(183, 28, 28);
    }
  }

  a + a {
    margin-left: 16px;
  }
`;

const CourseSelection = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: auto 200px;
  grid-template-rows: 32px 48px 240px;
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
              <a href="/" className="active">
                Schedule Generator
              </a>
              <a href="/feedback">Send Feedback</a>
            </Links>
          </Navbar>
          <CourseSelection>
            <CourseSearchContainer />
            <TermSelectorContainer />
            <SearchResultsContainer />
            <SelectedCoursesContainer />
          </CourseSelection>
          <GeneratedSchedulesContainer />
        </ScheduleGeneratorWrapper>
      );
    }
  }
);

export default function() {
  return <StoreProvider>{() => <ScheduleGenerator />}</StoreProvider>;
}
