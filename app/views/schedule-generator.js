import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import axios from 'axios';

import { api_url } from '../../config';

import CoursesView from './courses';
import SchedulesView from './schedules';

export default class ScheduleGenerator extends Component {

  state = {
    terms: [],
    selectedTerm: {},
    searchedCourses: [],
    selectedCourses: [],
    generatedSchedules: []
  }

  componentDidMount() {
    axios.get(`${api_url}/terms`)
      .then(res => res.data)
      .then(terms => terms.sort((a, b) => b.id - a.id))
      .then(terms => {
        this.setState({terms, selectedTerm: terms[0].id});
      });

    if (this.props.location.search.length) {
      this.generateSchedules();
    }
  }

  selectTerm = id => {
    this.setState({selectedTerm: id, searchCourses: [], selectedCourses: []});
  }

  searchCourses = query => {
    const { selectedTerm } = this.state;
    const subjects = query.match(/([a-zA-z]{3})/g);
    const numbers = query.match(/(\d+)/g);
    const subjects_query = subjects ? `&subjects=${subjects.join(',')}` : '';
    const numbers_query = numbers ? `&numbers=${numbers.join(',')}` : '';
    axios.get(`${api_url}/courses?term=${selectedTerm}${subjects_query}${numbers_query}`)
      .then(res => res.data)
      .then(courses => this.setState({searchedCourses: courses}));
  }

  selectCourse = course => {
    this.setState({selectedCourses: [...this.state.selectedCourses, course]});
  }

  deselectCourse = course => {
    this.setState({selectedCourses: this.state.selectedCourses.filter(selectedCourse => selectedCourse.id !== course.id)})
  }

  generateSchedules = () => {
    const query = parseQuery(this.props.location.search);
    const courses = query['courses'] || this.state.selectedCourses.map(c => c.id).join(',');
    axios.get(`${api_url}/schedules?courses=${courses}`)
      .then(res => {
        const { schedules } = res.data;
        this.setState({generatedSchedules: schedules})
      });
  }

  render() {
    return (
      <Switch>
        <Route path="/schedules" render={() =>
          <SchedulesView
            generatedSchedules={this.state.generatedSchedules}
          />
        }/> 
        <Route render={() => 
          <CoursesView
            terms={this.state.terms}
            searchedCourses={this.state.searchedCourses}
            selectedCourses={this.state.selectedCourses}
            onTermSelect={this.selectTerm}
            onCoursesSearch={this.searchCourses}
            onCourseSelect={this.selectCourse}
            onCourseDeselect={this.deselectCourse}
            onSchedulesGenerate={this.generateSchedules}
          />
        }/>
      </Switch>
    )
      
  }

}

function parseQuery(query) {
  return query.slice(1).split('&').reduce((acc, param) => {
    const [key, value] = param.split('=');
    acc[key] = value;
    return acc;
  }, {});
} 