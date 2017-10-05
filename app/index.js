import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import CoursesView from 'views/courses'
import SchedulesView from 'views/schedules'

import './index.scss'

const app =
  <BrowserRouter>
    <div className="app">
      <header>
        <a className="brand" href="/"><i className="fa fa-calendar"></i> Miami Scheduler</a>
        <nav>
          <a className="active" href="/">Schedule Generator</a>
          <a href="/courses">Course Catalog</a>
          <a href="/reviews">Instructor Reviews</a>
        </nav> 
      </header>
      <Switch>
        <Route exact path="/" component={CoursesView} />
        <Route path="/schedules" component={SchedulesView} /> 
        <Redirect to="/" />
      </Switch>
    </div>
  </BrowserRouter>

const start = () => render(app, document.getElementById('app'))

start()

if (module.hot) {
  module.hot.accept('index', start)
}
