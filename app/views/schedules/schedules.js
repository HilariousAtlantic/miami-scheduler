import React, { Component } from 'react'
import { debounce } from 'lodash'
import { get } from 'axios'

import './schedules.scss'

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
      .then(terms => this.setState({terms}))
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
      <div className="view schedules-view">
        <div className="schedule-options">
          <h3>Sort Schedules</h3>
          <div className="form-checkbox">
            <label>
              <input type="radio" checked />
              <span>Early classes</span>
            </label>
            <p className="note">
              Schedules with earlier classes will appear first
            </p>
          </div>
          <div className="form-checkbox">
            <label>
              <input type="radio" checked={false} />
              <span>Later classes</span>
            </label>
            <p className="note">
              Schedules with later classes will appear first
            </p>
          </div>
          <div className="form-checkbox">
            <label>
              <input type="radio" checked={false} />
              <span>Average grade</span>
            </label>
            <p className="note">
              Schedules with good instructors will appear first
            </p>
          </div>

          <h3>Full Sections</h3>
          <div className="form-checkbox">
            <label>
              <input type="checkbox" checked="checked" />
              <span>Hide schedule</span>
            </label>
            <p className="note">
              Schedules with a full section will not show
            </p>
          </div>
          <div className="form-checkbox">
            <label>
              <input type="checkbox" checked="checked" />
              <span>Fade section</span>
            </label>
            <p className="note">
              Full sections will appear faded in the calendar
            </p>
          </div>
            
        </div>
        <div className="schedule-list">
          <div className="schedule">
            <div className="schedule-header">
              <span className="times"><i className="fa fa-clock-o"></i></span>
              <span>Monday</span>
              <span>Tuesday</span>
              <span>Wednesday</span>
              <span>Thursday</span>
              <span>Friday</span>
            </div>
            <div className="schedule-body">
              <div className="schedule-column schedule-hours">
                <div className="schedule-hour">1am</div>
                <div className="schedule-hour">2am</div>
                <div className="schedule-hour">3am</div>
                <div className="schedule-hour">4am</div>
                <div className="schedule-hour">5am</div>
                <div className="schedule-hour">6am</div>
                <div className="schedule-hour">7am</div>
                <div className="schedule-hour">8am</div>
                <div className="schedule-hour">9am</div>
                <div className="schedule-hour">10am</div>
                <div className="schedule-hour">11am</div>
                <div className="schedule-hour">12pm</div>
                <div className="schedule-hour">1pm</div>
                <div className="schedule-hour">2pm</div>
                <div className="schedule-hour">3pm</div>
                <div className="schedule-hour">4pm</div>
                <div className="schedule-hour">5pm</div>
                <div className="schedule-hour">6pm</div>
                <div className="schedule-hour">7pm</div>
                <div className="schedule-hour">8pm</div>
                <div className="schedule-hour">9pm</div>
                <div className="schedule-hour">10pm</div>
                <div className="schedule-hour">11pm</div>
                <div className="schedule-hour">12am</div>
              </div>
              <div className="schedule-column"></div>
              <div className="schedule-column"></div>
              <div className="schedule-column"></div>
              <div className="schedule-column"></div>
              <div className="schedule-column"></div>
              <div className="schedule-column"></div>
            </div>
            <div className="schedule-actions">
              <button className="export-schedule">Export Schedule</button>
              <button className="schedule-nav"><i className="fa fa-arrow-left"></i></button>
              <input type="text" value="1 of 20" />
              <button className="schedule-nav"><i className="fa fa-arrow-right"></i></button>
            </div>
          </div>
        </div>
      </div>
    )
  }

}