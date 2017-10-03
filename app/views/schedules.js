import React, { Component } from 'react'
import { debounce } from 'lodash'
import { get } from 'axios'

import './schedules.scss'

const Days = ['M', 'T', 'W', 'R', 'F']
const Colors = ['#0D47A1', '#B71C1C', '#1B5E20', '#E65100', '#4A148C', '#263238']

const sorts = {
  early: (a, b) => a.weight - b.weight,
  later: (a, b) => b.weight - a.weight,
}

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

function formatTime(minutes) {
  let h = Math.floor(minutes / 60);
  let m = minutes % 60;
  if (h > 12) {
    h -= 12;
  } else if (h == 0) {
    h = 12;
  }
  return `${h}:${('0'+m).slice(-2)}`;
}

function Meet({crn, code, name, start_time, end_time, hall, room, instructors, color, locked, onClick}) {
  const styles = {
    background: color,
    top: start_time+'px',
    height: (end_time-start_time)+'px'
  }
  return (
    <div key={crn} className={['section', locked && 'locked'].join(' ')} style={styles} onClick={onClick}>
      <div className="section-info course-name">{code} {name}</div>
      <div className="section-info course-time">{formatTime(start_time)} - {formatTime(end_time)} {hall} {room}</div>
      <div className="section-info course-instructor">
        {instructors[0] && <span>{instructors[0].first_name} {instructors[0].last_name}</span>}
      </div>
      <div className="lock">
        <span>Click to {locked && 'un'}lock</span>
        <i className="fa fa-lock"></i>
      </div>
    </div>
  )
}

export default class CoursesView extends Component {

  state = {
    loading: true,
    schedules: [],
    currentScheduleIndex: 0,
    schedulesSort: 'early',
    lockedSections: []
  }

  componentWillMount() {
    get(`http://localhost:8000/api/schedules${this.props.location.search}`)
      .then(res => {
        const schedules = res.data;
        this.setState({schedules, loading: false})
      })
  }

  toggleLock = crn => {
    this.setState(({lockedSections, currentScheduleIndex}) => {
      if (lockedSections.includes(crn)) {
        console.log('removing', crn)
        return {lockedSections: lockedSections.filter(c => c !== crn), currentScheduleIndex: 0}
      } else {
        console.log('adding', crn)
        return {lockedSections: [...lockedSections, crn], currentScheduleIndex: 0}
      }
    })
  }

  render() {

    if (this.state.loading) return <span>Loading...</span>

    const { currentScheduleIndex, schedulesSort, lockedSections } = this.state
    const schedules = this.state.schedules
      .filter(schedule => lockedSections.every(crn => schedule.crns.indexOf(crn) !== -1))
      .sort(sorts[schedulesSort])
    
    const { crns, meets } = schedules[currentScheduleIndex]

    const nextSchedule = () => this.setState({currentScheduleIndex: currentScheduleIndex + 1})
    const prevSchedule = () => this.setState({currentScheduleIndex: currentScheduleIndex - 1})

    return (
      <div className="view schedules-view">
        <div className="sidebar">
          <header>
            <i className="fa fa-calendar"></i>
            <a href="/">Miami Scheduler</a>
          </header>
          <div className="schedule-sidebar">
            <div className="schedule-options">
              <h3>Sort Schedules</h3>
              <RadioGroup>
                <RadioButton text="Early Classes" hint="Schedules with earlier classes will show first" />
                <RadioButton text="Later Classes" hint="Schedules with later classes will show first" />
                <RadioButton text="Average Grade" hint="Schedules with easy instructors will show first" />
              </RadioGroup>
              <h3>Full Sections</h3>
              <RadioGroup>
                <RadioButton text="Hide Schedule" hint="Schedules with a full section will not show" />
                <RadioButton text="Fade Section" hint="Full sections will appear faded in the calendar" />
              </RadioGroup>     
            </div>
          </div>
        </div>
        <div className="content">
          <div className="toolbar">
            <div className="schedule-search">
              <button onClick={prevSchedule}><i className="fa fa-chevron-left"></i></button>
                <input type="text" value={`Schedule ${currentScheduleIndex + 1} of ${schedules.length}`} />
              <button onClick={nextSchedule}><i className="fa fa-chevron-right"></i></button>
            </div>
            <button className="button button--primary">Export Schedule</button>
          </div>
          <div className="schedule-container">
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
                    {meets[day].map(meet => <Meet {...meet} 
                      color={Colors[crns.indexOf(meet.crn)]}
                      locked={lockedSections.includes(meet.crn)}
                      onClick={() => this.toggleLock(meet.crn)}
                    />)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}