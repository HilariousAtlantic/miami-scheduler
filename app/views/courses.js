import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';

import './courses.scss';

export default class CoursesView extends Component {
  constructor(props) {
    super();
    this.searchCourses = debounce(props.onCoursesSearch, 600);
  }

  render() {
    const { terms, searchedCourses, selectedCourses } = this.props;
    const courses_query = selectedCourses.map(c => c.id).join(',');

    return (
      <div className="view courses-view">
        <div className="sidebar">
          <div className="course-search">
            <div className="search-input">
              <i className="fa fa-search" />
              <input
                type="text"
                placeholder="Search Courses"
                onChange={e => this.searchCourses(e.target.value)}
              />
            </div>
            <div className="terms-dropdown">
              <select onChange={e => this.props.onTermSelect(e.target.value)}>
                {terms.map(term => (
                  <option key={term.id} value={term.id}>
                    {term.name}
                  </option>
                ))}
              </select>
              <i className="fa fa-chevron-down" />
            </div>
          </div>
          <ul className="course-list">
            {searchedCourses.map(course => (
              <li
                key={course.id}
                onClick={() => this.props.onCourseSelect(course)}>
                {course.code} - {course.title}
              </li>
            ))}
          </ul>
          <Link
            className="button button--primary"
            to={`/schedules?courses=${courses_query}`}
            onClick={this.props.onSchedulesGenerate}>
            <span>Generate Schedules</span>
          </Link>
        </div>
        <div className="content">
          {selectedCourses.length ? (
            <ul className="selected-courses">
              {selectedCourses.map(course => (
                <li key={course.id}>
                  <button
                    className="button button--default deselect-course"
                    onClick={() => this.props.onCourseDeselect(course)}>
                    Remove
                  </button>
                  <span className="course-code">{course.code}</span>
                  <span className="course-title">{course.title}</span>
                  <p>{course.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="courses-message">
              <i className="fa fa-times" />
              <span>No Courses Selected</span>
              <p>
                Use the search bar to find the courses you would like to take
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
