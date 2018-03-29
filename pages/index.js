import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import { StoreProvider, withStore } from '../store';
import {
  GeneratedSchedulesContainer,
  TermSelectorContainer,
  CourseSearchContainer,
  ScheduleBrowser,
  ScheduleFiltersContainer,
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
  margin-bottom: 64px;
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
  margin-bottom: 64px;
  grid-gap: 8px;
  grid-template-columns: auto 240px;
  grid-template-rows: 48px 320px auto;
  grid-template-areas:
    'course-search term-selector'
    'search-results search-results'
    'selected-courses selected-courses';
`;

const ScheduleGenerator = withStore(
  class extends Component {
    componentWillMount() {
      const { actions } = this.props.store;
      actions.fetchTerms();
    }

    render() {
      const { state } = this.props.store;

      const showScheduleSection = state.generatedSchedules.length > 0;

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
          {showScheduleSection && (
            <Fragment>
              <ScheduleBrowser />
              {state.showFilters && <ScheduleFiltersContainer />}
              <GeneratedSchedulesContainer />
            </Fragment>
          )}
        </ScheduleGeneratorWrapper>
      );
    }
  }
);

export default function() {
  return <StoreProvider>{() => <ScheduleGenerator />}</StoreProvider>;
}
