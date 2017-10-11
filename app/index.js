import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Switch, Redirect, NavLink } from 'react-router-dom'

import ScheduleGenerator from './views/schedule-generator'
import SchedulesView from 'views/schedules'

import './index.scss'

const app =
  <BrowserRouter>
    <div className="app">
      <header>
        <a className="brand" href="/"><i className="fa fa-calendar"></i> Miami Scheduler</a>
        <nav>
          <NavLink activeClassName="active" to="/">Schedule Generator</NavLink>
          <NavLink activeClassName="active" to="/reviews">Instructor Reviews</NavLink>
        </nav> 
      </header>
      <Switch>
        <Route path="/" component={ScheduleGenerator} />
      </Switch>
    </div>
  </BrowserRouter>

const start = () => render(app, document.getElementById('app'))

start()

if (module.hot) {
  module.hot.accept('index', start)
}
