import React, { Component } from 'react'
import { debounce } from 'lodash'
import { get } from 'axios'

import './schedules.scss'

const Days = ['M', 'T', 'W', 'R', 'F']

function RadioButton({text, hint}) {
  return (
    <div className="form-checkbox">
      <label>
        <input type="radio" checked={false} />
        <span>{text}</span>
      </label>
      <p className="note">
        {hint}
      </p>
    </div>
  )
}

function RadioGroup({children, onChange}) {
  return (
    <div className="radio-group">
      {children}
    </div>
  )
}

function Meet({crn, code, start_time, end_time, hall, room}) {
  const toMinutes = time => {
    let [h, m] = time.split(':')
    return 60*parseInt(h) + parseInt(m)
  }
  const positioning = {
    top: toMinutes(start_time)+'px',
    height: (toMinutes(end_time)-toMinutes(start_time))+'px'
  }
  return (
    <div key={crn} className="section" style={positioning}>
      <span>{code}</span>
      <span>{start_time} - {end_time} {hall} {room}</span>
    </div>
  )
}

export default class CoursesView extends Component {

  state = {
    currentScheduleIndex: 0,
    schedulesSort: () => {},
    lockedSections: []
  }

  render() {

    const { currentScheduleIndex, schedulesSort } = this.state
    const { schedules } = this.props
    const currentSchedule = schedules.sort(schedulesSort)[currentScheduleIndex]

    const nextSchedule = () => this.setState({currentScheduleIndex: currentScheduleIndex + 1})
    const prevSchedule = () => this.setState({currentScheduleIndex: currentScheduleIndex - 1})

    return (
      <div className="view schedules-view">
        <div className="schedule-sidebar">
          <div className="schedule-search">
            <button className="schedule-nav" onClick={prevSchedule}><i className="fa fa-arrow-left"></i></button>
              <input type="text" value={`Schedule ${currentScheduleIndex + 1} of ${schedules.length}`} />
            <button className="schedule-nav" onClick={nextSchedule}><i className="fa fa-arrow-right"></i></button>
          </div>
          <div className="schedule-options">
            <h3>Sort Schedules</h3>
            <RadioGroup>
              <RadioButton text="Early Classes" hint="Schedules with earlier classes will show first" />
              <RadioButton text="Later Classes" hint="Schedules with later classes will show first" />
              <RadioButton text="Average Grade" hint="Schedules with good instructors will show first" />
            </RadioGroup>
            <h3>Full Sections</h3>
            <RadioGroup>
              <RadioButton text="Hide Schedule" hint="Schedules with a full section will not show" />
              <RadioButton text="Fade Section" hint="Full sections will appear faded in the calendar" />
            </RadioGroup>     
          </div>
        </div>
        <div className="schedule-list">
          <div className="schedule">
            <div className="schedule-header">
              <span className="schedule-column"><i className="fa fa-clock-o"></i></span>
              <span className="schedule-column">Monday</span>
              <span className="schedule-column">Tuesday</span>
              <span className="schedule-column">Wednesday</span>
              <span className="schedule-column">Thursday</span>
              <span className="schedule-column">Friday</span>
            </div>
            <div className="schedule-body">
              <div className="schedule-column">
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
              {Days.map(day =>
                <div key={day} className="schedule-column">
                  {currentSchedule.meets[day].map(meet => <Meet {...meet} />)}
                </div>
              )}
            </div>
            <button className="export-schedule">Export Schedule</button>
          </div>
        </div>
      </div>
    )
  }

}