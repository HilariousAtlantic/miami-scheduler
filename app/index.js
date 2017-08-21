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
        <span>Miami Scheduler</span>
      </header>
      <Switch>
        <Route exact path="/">
          <Redirect to="/courses" />
        </Route>
        <Route path="/courses" component={CoursesView} />
        <Route path="/schedules" component={SchedulesView} /> 
      </Switch>
    </div>
  </BrowserRouter>

const start = () => render(app, document.getElementById('app'))

start()

if (module.hot) {
  module.hot.accept('index', start)
}
