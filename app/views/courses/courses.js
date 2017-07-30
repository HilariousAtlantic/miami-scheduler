import React, { Component } from 'react'
import { debounce } from 'lodash'
import { get } from 'axios'

import './courses.scss'

export default class CoursesView extends Component {

  constructor() {
    super()
    this.state = {courses: [], selectedCourses: []}
    this.handleChange = this.handleChange.bind(this)
    this.selectCourse = this.selectCourse.bind(this)
    this.deselectCourse = this.deselectCourse.bind(this)
    this.deselectAllCourses = this.deselectAllCourses.bind(this)
    this.searchCourses = debounce(this.searchCourses.bind(this), 600)
  }

  handleChange(e) {
    let query = encodeURI(e.target.value)
    this.searchCourses(query)
  }

  searchCourses(query) {
    get(`http://localhost:8000/api/courses?term=201810&q=${query}`)
      .then(response => response.data)
      .then(courses => this.setState({courses}))
  }

  selectCourse(course) {
    if (this.state.selectedCourses.indexOf(course) !== -1) return
    this.setState({selectedCourses: [...this.state.selectedCourses, course]})
  }

  deselectCourse(course) {
    this.setState({selectedCourses: this.state.selectedCourses.filter(selectedCourse => selectedCourse.id !== course.id)})
  }

  deselectAllCourses() {
    this.setState({selectedCourses: []})
  }

  render() {
    let creditTotal = this.state.selectedCourses.reduce((total, course) => {
      total.low += course.credits.lecture_low + course.credits.lab_low
      total.high += course.credits.lecture_high + course.credits.lab_high
      return total
    }, {low: 0, high: 0})

    return (
      <div className="view courses-view">
        <div className="course-search">
          <input type="text" placeholder="Search Courses" onChange={this.handleChange} />
          <ul>
            {this.state.courses.map(course => {
              const selectCourse = () => {
                this.selectCourse(course)
              }
              return (
                <li key={course.id} onClick={selectCourse}>
                  {course.subject} {course.number} - {course.title}
                </li>
              )
            })}
          </ul>
        </div>
        <div className="selected-courses">
          <div className="courses-toolbar">
            <button className="btn btn-secondary btn-sm" onClick={this.deselectAllCourses}>Remove All</button>
            <div className="clearfix">
              <button className="btn btn-secondary btn-sm btn-with-count">Credits</button>
              <span className="social-count">{creditTotal.low} - {creditTotal.high}</span>
            </div>
          </div>
          <ul>
            {this.state.selectedCourses.map(course => (
              <li key={course.id}>
                <h5>{course.subject} {course.number}</h5>
                <span>{course.title}</span>
                <p>{course.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

}