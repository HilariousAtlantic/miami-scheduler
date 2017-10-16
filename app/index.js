import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Switch, Redirect, NavLink } from 'react-router-dom'

import ScheduleGenerator from './views/schedule-generator'
import InstructorReviews from './views/reviews'
import NotFound from './views/not-found'

import './index.scss'

const app =
  <BrowserRouter>
    <div className="app">
      <header>
        <a className="brand" href="/">Miami Scheduler</a>
        <nav>
          <NavLink exact activeClassName="active" to="/">Schedule Generator</NavLink>
          <NavLink activeClassName="active" to="/reviews">Instructor Reviews</NavLink>
        </nav> 
      </header>
      <Switch>
        <Route exact path="/" component={ScheduleGenerator} />
        <Route path="/schedules" component={ScheduleGenerator} />
        <Route path="/reviews" component={InstructorReviews} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </BrowserRouter>

const start = () => render(app, document.getElementById('app'))

start()

if (module.hot) {
  module.hot.accept('index', start)
}
