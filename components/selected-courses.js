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

const List = styled.ul`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 40px;
  grid-gap: 8px;

  @media screen and (max-width: 480px) {
    grid-template-columns: 1fr;
    grid-auto-rows: 40px;
  }
`;

const ListItem = styled.li`
  display: flex;
  list-style: none;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  background: ${props => props.color || '#4a4a4a'};
  padding: 16px;
  font-size: 12px;
  font-weight: 500;
  opacity: ${props => (props.loading ? 0.5 : 1)};
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);

  i {
    cursor: pointer;
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
              <i className="fa fa-spinner fa-spin" />
            ) : (
              <i
                className="fa fa-times"
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
          onSelectCourse={code => actions.deselectCourse(code)}
        />
      )}
    </StoreConsumer>
  );
}
