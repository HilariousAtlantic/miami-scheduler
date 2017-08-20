import React, { Component } from 'react'
import { get } from 'axios'

import CoursesView from 'views/courses/courses'
import SchedulesView from 'views/schedules/schedules'

import './app.scss'

export default class App extends Component {

  state = {
    selectedTerm: {},
    selectedCourses: [],
    generatingSchedules: false,
    generatedSchedules: []
  }

  selectCourse = course => {
    this.setState({selectedCourses: [...this.state.selectedCourses, course]});
  }

  deselectCourse = course => {
    this.setState({selectedCourses: this.state.selectedCourses.filter(selectedCourse => selectedCourse.id !== course.id)})
  }
  
  generateSchedules = () => {
    const courseIds = this.state.selectedCourses.map(course => course.id).join(',')
    get(`http://localhost:8000/api/schedules?courses=${courseIds}`)
      .then(res => {
        const generatedSchedules = res.data;
        this.setState({generatedSchedules})
      })
  }

  render() {
    return (
      <div className="app">
        <header>
          <span>Miami Scheduler</span>
        </header>
        {this.state.generatedSchedules.length ? (
          <SchedulesView 
            schedules={this.state.generatedSchedules}
          />
        ) : (
          <CoursesView 
            selectedCourses={this.state.selectedCourses} 
            onCourseSelect={this.selectCourse}
            onCourseDeselect={this.deselectCourse}
            onSchedulesGenerate={this.generateSchedules}
          />
        )}
      </div>
    )
  }
}
