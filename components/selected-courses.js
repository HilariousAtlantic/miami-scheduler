import React, { Component } from 'react';
import styled from 'styled-components';

import { StoreConsumer } from '../store';

const colors = [
  '#0D47A1',
  '#B71C1C',
  '#1B5E20',
  '#E65100',
  '#4A148C',
  '#006064',
  '#263238'
];

const SelectedCoursesWrapper = styled.div`
  grid-area: selected-courses;
`;

const List = styled.ul``;

const ListItem = styled.li`
  display: inline-flex;
  width: 88px;
  height: 32px;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  background: ${props => props.color || '#4a4a4a'};
  padding: 8px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);
  opacity: ${props => (props.loading ? 0.5 : 1)};

  + li {
    margin-left: 8px;
  }
`;

function SelectedCourses({ courses, onSelectCourse }) {
  return (
    <SelectedCoursesWrapper>
      <List>
        {courses.map((course, i) => (
          <ListItem
            key={course.code}
            color={colors[i]}
            loading={course.loading}
          >
            <span>
              {course.subject} {course.number}
            </span>
            {course.loading ? (
              <i className="fa fa-close fa-spin" />
            ) : (
              <i
                className="fa fa-close"
                onClick={() => onSelectCourse(course.code)}
              />
            )}
          </ListItem>
        ))}
      </List>
    </SelectedCoursesWrapper>
  );
}

export function SelectedCoursesContainer() {
  return (
    <StoreConsumer>
      {(state, actions) => (
        <SelectedCourses
          courses={[
            ...state.selectedCourses.map(code => state.coursesByCode[code]),
            ...state.loadingCourses.map(code => ({
              ...state.coursesByCode[code],
              loading: true
            }))
          ]}
          onSelectCourse={code => {
            actions.deselectCourse(code);
            actions.generateSchedules();
          }}
        />
      )}
    </StoreConsumer>
  );
}
