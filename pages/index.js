import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import { StoreProvider, withStore } from '../store';
import {
  ScheduleListContainer,
  TermSelectorContainer,
  CourseSearchContainer,
  ScheduleFiltersContainer,
  ScheduleToolbarContainer,
  SearchResultsContainer,
  SelectedCoursesContainer
} from '../components';

const ScheduleGeneratorWrapper = styled.div``;

const Navbar = styled.header`
  width: 90%;
  max-width: 1280px;
  margin: 32px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled.a`
  color: #2a2a2a;
  text-decoration: none;
  font-weight: 400;
  font-size: 24px;
`;

const Links = styled.nav`
  display: flex;
  align-items: center;
  font-size: 14px;

  a {
    color: #2a2a2a;
    text-decoration: none;
    padding: 8px 0;

    &.active {
      border-bottom: 2px solid rgb(183, 28, 28);
    }
  }

  a + a {
    margin-left: 24px;
  }
`;

const DonateButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: 2px solid #3d95ce;
  border-radius: 50px;
  padding: 12px 24px;
  color: #3d95ce;
  font-weight: 900;
  margin-left: 32px;
  font-size: 12px;

  &:hover {
    background: #3d95ce;
    color: #fff;

    svg {
      fill: #fff;
    }
  }

  svg {
    fill: #3d95ce;
    height: 16px;
    margin-right: 8px;
  }
`;

const SectionHeader = styled.h2`
  display: flex;
  align-items: center;
  margin: 0;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 500;
  color: #4a4a4a;

  > span {
    margin-right: 8px;
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

const VenmoIcon = (
  <i
    dangerouslySetInnerHTML={{
      __html: `
        <?xml version="1.0" encoding="utf-8"?>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 162 162" style="enable-background:new 0 0 162 162;" xml:space="preserve">
          <path d="M136.8,14.9c4.8,8,7,16.2,7,26.6c0,33.2-28.3,76.2-51.3,106.5H40L19,22.1l46-4.4l11.1,89.6c10.4-16.9,23.2-43.6,23.2-61.7c0-9.9-1.7-16.7-4.4-22.3L136.8,14.9z"/>
        </svg>
      `
    }}
  />
);

function NumberIcon({ children }) {
  return (
    <span className="fa-2x fa-layers fa-fw">
      <i className="fas fa-circle" />
      <span className="fa-layers-text fa-inverse" data-fa-transform="shrink-10">
        {children}
      </span>
    </span>
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
              <DonateButton>
                {VenmoIcon}
                <span>Donate</span>
              </DonateButton>
            </Links>
          </Navbar>

          <CourseSection>
            <SectionHeader>
              <NumberIcon>1</NumberIcon>
              Select Courses
            </SectionHeader>
            <CourseSelector>
              <CourseSearchContainer />
              <TermSelectorContainer />
              <SearchResultsContainer />
              <SelectedCoursesContainer />
            </CourseSelector>
          </CourseSection>

          {showScheduleSection && (
            <Fragment>
              <FilterSection>
                <SectionHeader>
                  <NumberIcon>2</NumberIcon>
                  Customize Filters
                </SectionHeader>
                <ScheduleFiltersContainer />
              </FilterSection>
              <ScheduleSection>
                <SectionHeader>
                  <NumberIcon>3</NumberIcon>
                  Browse Schedules
                </SectionHeader>
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
