import React, { Component, Fragment } from 'react';
import styled, { keyframes } from 'styled-components';

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

const GenerationSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 960px;
  margin: 64px auto;
  text-align: center;

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 64px;
    color: #4a4a4a;
  }
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

const SectionMessage = styled.div`
  margin: 32px;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
`;

const GenerationStatusWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 32px;
  background: #ffffff;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: ${props => props.status}%;
  background: rgb(183, 28, 28);
  transition: width 200ms linear;
`;

function GenerationStatus({ status }) {
  return (
    <GenerationStatusWrapper>
      <ProgressBar status={status} />
    </GenerationStatusWrapper>
  );
}

const ScheduleGenerator = withStore(
  class extends Component {
    componentWillMount() {
      const { actions } = this.props.store;
      actions.fetchTerms();
    }

    render() {
      const { state } = this.props.store;
      const showGenerationSection =
        state.generatingSchedules === state.selectedCourses.join('');
      const showFilterSection =
        !showGenerationSection && state.generatedSchedules.length > 0;
      const showScheduleSection =
        showFilterSection && state.filteredSchedules.length > 0;

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

          {showGenerationSection && (
            <GenerationSection>
              <GenerationStatus status={state.generationStatus} />
              <span>Generating Schedules ({state.generationStatus}%)</span>
            </GenerationSection>
          )}

          {showFilterSection && (
            <Fragment>
              <FilterSection>
                <SectionHeader>2. Customize Filters</SectionHeader>
                <ScheduleFiltersContainer />
              </FilterSection>

              <ScheduleSection>
                <SectionHeader>3. Browse Schedules</SectionHeader>
                {showScheduleSection ? (
                  <Fragment>
                    <ScheduleToolbarContainer />
                    <ScheduleListContainer />
                  </Fragment>
                ) : (
                  <SectionMessage>
                    There are no schedules that match all of the filters. Keep
                    deleting one until some schedules appear.
                  </SectionMessage>
                )}
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
