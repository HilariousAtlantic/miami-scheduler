import React from 'react'

import CoursesView from 'views/courses/courses'
import SchedulesView from 'views/schedules/schedules'

import './app.scss'

const App = () => (
  <div className="app">
    <header>
      <span>Miami Scheduler</span>
    </header>
    <CoursesView />
    <SchedulesView />
  </div>
)

export default App
