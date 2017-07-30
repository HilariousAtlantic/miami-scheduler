import React, { Component } from 'react'
import { debounce } from 'lodash'
import { get } from 'axios'

import './courses.scss'

export default class CoursesView extends Component {

  constructor() {
    super()
    this.state = {courses: []}
    this.handleChange = this.handleChange.bind(this)
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

  render() {
    return (
      <div className="view courses-view">
        <h1>Miami Scheduler</h1>
        <input type="text" onChange={this.handleChange} />
        <ul>
          {this.state.courses.map(course => (
            <li key={course.id}>{course.subject} {course.number} - {course.title}</li>
          ))}
        </ul>
      </div>
    )
  }

}