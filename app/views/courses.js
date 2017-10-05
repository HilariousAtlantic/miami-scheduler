import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { debounce } from 'lodash'
import { get } from 'axios'

import './courses.scss'

export default class CoursesView extends Component {

  constructor() {
    super()
    this.state = {loading: true, terms: [], selectedTerm: null, courses: [], selectedCourses: [], query: ''}
    this.handleChange = this.handleChange.bind(this)
    this.selectTerm = this.selectTerm.bind(this)
    this.searchCourses = debounce(this.searchCourses.bind(this), 600)
  }

  componentDidMount() {
    get('http://localhost:8000/api/terms')
      .then(response => response.data)
      .then(terms => terms.sort((a, b) => b.id - a.id))
      .then(terms => this.setState({terms, selectedTerm: terms[0].id, loading: false}))
  }

  handleChange(e) {
    this.setState({ query: encodeURI(e.target.value) })
    this.searchCourses()
  }

  searchCourses() {
    const { selectedTerm, query } = this.state
    get(`http://localhost:8000/api/courses?term=${selectedTerm}&q=${query}`)
      .then(response => response.data)
      .then(courses => this.setState({courses}))
  }

  selectTerm(e) {
    this.setState({selectedTerm: e.target.value, courses: [], selectedCourses: []}, () => {
      this.searchCourses()
    })
  }

  selectCourse = course => {
    this.setState({selectedCourses: [...this.state.selectedCourses, course]});
  }

  deselectCourse = course => {
    this.setState({selectedCourses: this.state.selectedCourses.filter(selectedCourse => selectedCourse.id !== course.id)})
  }

  render() {

    if (this.state.loading) return <span>Loading...</span>

    const {low, high} = this.state.selectedCourses.reduce((total, course) => {
      total.low += course.credits.lecture_low + course.credits.lab_low
      total.high += course.credits.lecture_high + course.credits.lab_high
      return total
    }, {low: 0, high: 0})

    let courseIds = this.state.selectedCourses.map(c => c.id).join(',')

    return (
      <div className="view courses-view">
        <div className="sidebar">
          <div className="course-search">
            <div className="search-input">
              <i className="fa fa-search"></i>
              <input type="text" placeholder="Search Courses" onChange={this.handleChange} />
            </div>
            <div className="terms-dropdown">
              <select onChange={this.selectTerm}>
                {this.state.terms.map(term => <option key={term.id} value={term.id}>{term.name}</option>)}
              </select>
              <i className="fa fa-chevron-down"></i>
            </div>
          </div>
          <ul className="course-list">
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
          <Link className="button button--primary" to={`/schedules?courses=${courseIds}`}>
            <span>Generate Schedules</span>
          </Link>
        </div>
        <div className="content">
          <ul className="selected-courses">
            {this.state.selectedCourses.map(course => {
              const deselectCourse = () => {
                this.deselectCourse(course)
              }
              return (
                <li key={course.id}>
                  <button className="button button--default deselect-course" onClick={deselectCourse}>Remove</button>
                  <span className="course-code">{course.code}</span>
                  <span className="course-title">{course.title}</span>
                  <p>{course.description}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }

}
