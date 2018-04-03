import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import { StoreProvider, withStore } from '../store';
import {
  Navbar,
  ScheduleListContainer,
  TermSelectorContainer,
  CourseSearchContainer,
  ScheduleFiltersContainer,
  ScheduleToolbarContainer,
  SearchResultsContainer,
  SelectedCoursesContainer
} from '../components';

const ScheduleGeneratorWrapper = styled.div``;

const SectionHeader = styled.h2`
  display: flex;
  align-items: center;
  margin: 32px 0;
  font-size: 24px;
  font-weight: 300;
  color: #4a4a4a;
  text-align: center;

  &:before, &:after {
    content: "";
    display: block
    height: 1px;
    flex: 1;
    border-bottom: 2px solid #4a4a4a;
    margin: 0 16px;
  }
`;

const CourseSection = styled.section`
  width: 90%;
  max-width: 960px;
  margin: 64px auto;
`;

const CourseSelector = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: auto 240px;
  grid-template-rows: 48px 320px auto;
  grid-template-areas:
    'course-search term-selector'
    'search-results search-results'
    'selected-courses selected-courses';
`;

const FilterSection = styled.section`
  width: 90%;
  max-width: 960px;
  margin: 64px auto;
`;

const ScheduleSection = styled.section`
  width: 90%;
  max-width: 960px;
  margin: 64px auto;
  display: flex;
  flex-direction: column;
`;

const ScheduleGenerator = withStore(
  class extends Component {
    componentWillMount() {
      const { actions } = this.props.store;
      actions.fetchTerms();
    }

    render() {
      const { state } = this.props.store;
      const showGenerationLoader =
        state.generatingSchedules[
          state.loadingCourses.concat(state.selectedCourses).join('')
        ];
      const showScheduleSection =
        !showGenerationLoader && state.generatedSchedules.length > 0;

      return (
        <ScheduleGeneratorWrapper>
          <Navbar activeLink="generator" />
          <CourseSection>
            <SectionHeader>1. Select Courses</SectionHeader>
            <CourseSelector>
              <CourseSearchContainer />
              <TermSelectorContainer />
              <SearchResultsContainer />
              <SelectedCoursesContainer />
            </CourseSelector>
          </CourseSection>

          {showGenerationLoader && <span>Generating Schedules</span>}

          {showScheduleSection && (
            <Fragment>
              <FilterSection>
                <SectionHeader>2. Customize Filters</SectionHeader>
                <ScheduleFiltersContainer />
              </FilterSection>
              <ScheduleSection>
                <SectionHeader>3. Browse Schedules</SectionHeader>
                <ScheduleToolbarContainer />
                <ScheduleListContainer />
              </ScheduleSection>
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
