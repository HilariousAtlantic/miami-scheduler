import React, { Component } from 'react'
import { debounce } from 'lodash'
import { get } from 'axios'

import './courses.scss'

export default class CoursesView extends Component {

  constructor() {
    super()
    this.state = {terms: [], selectedTerm: null, courses: [], selectedCourses: []}
    this.handleChange = this.handleChange.bind(this)
    this.selectTerm = this.selectTerm.bind(this)
    this.selectCourse = this.selectCourse.bind(this)
    this.deselectCourse = this.deselectCourse.bind(this)
    this.searchCourses = debounce(this.searchCourses.bind(this), 600)
  }

  componentDidMount() {
    get('http://localhost:8000/api/terms')
      .then(response => response.data)
      .then(terms => terms.sort((a, b) => b.id - a.id))
      .then(terms => this.setState({terms, selectedTerm: terms[0].id}))
  }

  handleChange(e) {
    let term = this.state.selectedTerm
    let query = encodeURI(e.target.value)
    this.searchCourses(term, query)
  }

  searchCourses(term, query) {
    get(`http://localhost:8000/api/courses?term=${term}&q=${query}`)
      .then(response => response.data)
      .then(courses => this.setState({courses}))
  }

  selectTerm(e) {
    this.setState({selectedTerm: e.target.value, courses: [], selectedCourses: []})
  }

  selectCourse(course) {
    if (this.state.selectedCourses.indexOf(course) !== -1) return
    this.setState({selectedCourses: [...this.state.selectedCourses, course]})
  }

  deselectCourse(course) {
    this.setState({selectedCourses: this.state.selectedCourses.filter(selectedCourse => selectedCourse.id !== course.id)})
  }

  render() {
    let creditTotal = this.state.selectedCourses.reduce((total, course) => {
      total.low += course.credits.lecture_low + course.credits.lab_low
      total.high += course.credits.lecture_high + course.credits.lab_high
      return total
    }, {low: 0, high: 0})

    return (
      <div className="view courses-view">
        <div className="course-list">
          <div className="course-search">
            <input type="text" placeholder="Search Courses" onChange={this.handleChange} />
            <div className="terms-dropdown">
              <select onChange={this.selectTerm}>
                {this.state.terms.map(term => <option key={term.id} value={term.id}>{term.name}</option>)}
              </select>
              <i className="fa fa-angle-down"></i>
            </div>
          </div>
          <ul>
            {this.state.courses.map(course => {
              const selectCourse = () => {
                this.selectCourse(course)
              }
              return (
                <li key={course.id} onClick={selectCourse}>
                  {course.code} - {course.title}
                </li>
              )
            })}
          </ul>
        </div>
        <div className="selected-courses">
          <ul>
            {this.state.selectedCourses.map(course => {
              const deselectCourse = () => {
                this.deselectCourse(course)
              }
              return (
                <li key={course.id}>
                  <button className="btn btn-secondary btn-sm deselect-course" onClick={deselectCourse}>Remove</button>
                  <span className="course-code">{course.subject} {course.number}</span>
                  <span className="course-title">{course.title}</span>
                  <p>{course.description}</p>
                </li>
              )
            })}
          </ul>
          <button className="generate-schedules">
            <span>Generate Schedules</span>
            <span className="credit-total">
              {creditTotal.low === creditTotal.high ? creditTotal.high : `${creditTotal.low} - ${creditTotal.high}`} Credits
            </span>
          </button>
        </div>
      </div>
    )
  }

}
