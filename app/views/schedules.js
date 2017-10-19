import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { debounce } from 'lodash'
import { get } from 'axios'
import download from 'downloadjs';

import { RadioGroup, Radio } from '../components/radio-group/radio-group'
import { CheckGroup, Check } from '../components/check-group/check-group'

import { api_url } from '../../config';
import './schedules.scss'

const Days = ['M', 'T', 'W', 'R', 'F']
const DayNames = {
  M: 'Monday',
  T: 'Tuesday',
  W: 'Wednesday',
  R: 'Thursday',
  F: 'Friday'
}
const Colors = ['#0D47A1', '#B71C1C', '#1B5E20', '#E65100', '#4A148C', '#263238']

const sorts = {
  early: (a, b) => a.weight - b.weight,
  later: (a, b) => b.weight - a.weight,
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

function Meet({crn, code, name, start_time, end_time, hall, room, instructors, color, locked, onClick, slots, fade}) {
  const styles = {
    background: color,
    opacity: fade ? .5 : 1,
    top: (start_time - 360)+'px',
    height: (end_time-start_time)+'px'
  }
  return (
    <div key={crn} className={['section', locked && 'locked'].join(' ')} style={styles} onClick={onClick}>
      <div className="section-info course-name">{code} {name}</div>
      <div className="section-info course-time">{formatTime(start_time)} - {formatTime(end_time)} {hall} {room}</div>
      <div className="section-info course-instructor">
        {instructors[0] && <span>{instructors[0].first_name} {instructors[0].last_name}</span>}
      </div>
      {slots && <div className="section-slots">
        {slots.rem} Slots Left
      </div>}
      <div className="lock">
        <span>Click to {locked && 'un'}lock</span>
        <i className="fa fa-lock"></i>
      </div>
    </div>
  )
}

function ClassLoad({day, min = '', max = '', onChange}) {
  const handleChange = c => onChange(Object.assign({min, max}, c));
  return (
    <div className="class-load">
      <span className="class-load__header">{day}</span>
      <div className="class-load__form">
        <input 
          type="number"
          placeholder="min"
          min="0"  
          value={min} 
          onChange={e => handleChange({min: parseInt(e.target.value)})} 
        />
        <span> - </span>
        <input
          type="number"
          placeholder="max"
          min="0"
          value={max}
          onChange={e => handleChange({max: parseInt(e.target.value)})}
        />
        <button onClick={() => handleChange({min: undefined, max: undefined})}>Reset</button>
      </div>
    </div>
  )
}

function getUniqueInstructors(course) {
  const instructors = course.sections.reduce((instructors, section) => {
    for (let {first_name, last_name} of section.instructors) {
      instructors[`${first_name} ${last_name}`] = true;
    }
    return instructors;
  }, {});
  return Object.keys(instructors);
}

export default class SchedulesView extends Component {

  state = {
    slots: [],
    instructors: {},
    attributes: {},
    currentScheduleIndex: 0,
    schedulesSort: 'early',
    lockedSections: [],
    instructorFilters: {},
    filterFullSchedules: false,
    fadeFullSections: false,
    classLoads: {
      M: {},
      T: {},
      W: {},
      R: {},
      F: {}
    }
  }

  toggleLock = crn => {
    this.setState(({lockedSections, currentScheduleIndex}) => {
      if (lockedSections.includes(crn)) {
        return {lockedSections: lockedSections.filter(c => c !== crn)}
      } else {
        return {lockedSections: [...lockedSections, crn], currentScheduleIndex: 0}
      }
    })
  }

  resetFilters = () => {
    this.setState({
      lockedSections: [], 
      instructorFilters: {}, 
      currentScheduleIndex: 0,
      filterFullSchedules: false,
      fadeFullSections: false,
      schedulesSort: 'early',
      classLoads: {
        M: {},
        T: {},
        W: {},
        R: {},
        F: {}
      }
    });
  }

  downloadSchedule() {
    const schedule = document.querySelector('.schedule').cloneNode(true);
    schedule.className += ' exported';
    document.body.appendChild(schedule);
    html2canvas(schedule, {scale: 2.5})
      .then(canvas => {
        download(canvas.toDataURL('image/jpg', 1), 'schedule.jpg', 'image/jpg');
        document.body.removeChild(schedule)
      });
  }

  render() {
    const {
      selectedCourses,
      loadingschedules,
      generatedSchedules,
      uniqueInstructors,
      uniqueAttributes,
      slots
    } = this.props;
    const { 
      currentScheduleIndex, 
      schedulesSort, 
      instructors, 
      attributes, 
      lockedSections,
      instructorFilters,
      attributeFilters,
      filterFullSchedules,
      fadeFullSections,
      classLoads
    } = this.state;
    const enabledInstructors = Object.keys(instructorFilters).filter(instructor => instructorFilters[instructor]);
    const schedules = generatedSchedules
      .filter(schedule => {
        return lockedSections.every(crn => schedule.crns.indexOf(crn) !== -1) &&
        (!enabledInstructors.length || enabledInstructors.find(instructor => schedule.instructors.indexOf(instructor) !== -1)) &&
        Object.keys(classLoads).every(day => schedule.meets[day].length >= (classLoads[day].min || -Infinity) && schedule.meets[day].length <= (classLoads[day].max >= 0 ? classLoads[day].max : Infinity)) &&
        (!filterFullSchedules || schedule.crns.every(crn => !slots[crn] || slots[crn].rem > 0));
      })
      .sort(sorts[schedulesSort])
    
    const { crns, meets } = schedules[currentScheduleIndex] || {}

    const nextSchedule = () => this.setState({currentScheduleIndex: currentScheduleIndex + 1})
    const prevSchedule = () => this.setState({currentScheduleIndex: currentScheduleIndex - 1})

    return (
      <div className="view schedules-view">
        <div className="sidebar">  
          <div className="schedule-options">
            <Link to="/">Change Courses</Link>
            <button onClick={this.resetFilters}>Reset Filters</button>
          </div>
          <div className="schedule-search">
            <button onClick={prevSchedule}><i className="fa fa-chevron-left"></i></button>
              <input type="text" value={`Schedule ${currentScheduleIndex + 1} of ${schedules.length}`} readOnly />
            <button onClick={nextSchedule}><i className="fa fa-chevron-right"></i></button>
          </div>


          <div className="schedule-filters">
            <div className="filter-section">
              <h3 className="filter-section__header">Sort Schedules</h3>
              <RadioGroup
                name="classTime"
                selectedValue={schedulesSort}
                onChange={(e) => this.setState({ schedulesSort: e.target.value})}>
                <Radio
                  value="early"
                  hint="Schedules with earlier classes will show first">
                  Early Classes
                </Radio>
                <Radio
                  hint="Schedules with later classes will show first"
                  value="later">
                  Later Classes
                </Radio>
              </RadioGroup>
            </div>


            <div className="filter-section">
              <h3 className="filter-section__header">Full Sections</h3>
              <Check
                checked={filterFullSchedules}
                onChange={(_, checked) => this.setState({filterFullSchedules: checked})}
                text="Hide Schedule"
                hint="Schedules with a full section will not show"
              />
              <Check
                checked={fadeFullSections}
                onChange={(_, checked) => this.setState({fadeFullSections: checked})}
                text="Fade Section"
                hint="Full sections will appear faded in the calendar"
              />
            </div>
            

            <div className="filter-section">
              <h3 className="filter-section__header">Class Load</h3>
              <p className="filter-section__info">Only schedules that meet within the ranges will show</p>
              <div className="class-load-form">
                {Days.map(day => <ClassLoad key={day}
                  day={DayNames[day]}
                  min={classLoads[day].min}
                  max={classLoads[day].max}
                  onChange={c => this.setState({classLoads: {...classLoads, [day]: c}, currentScheduleIndex: 0})}
                />)}
              </div>
            </div>
            
            <div className="filter-section">
              <h3 className="filter-section__header">Choose Instructors</h3>
              <p className="filter-section__info">Only schedules with the selected instructors will show</p>
              {selectedCourses.map(course => !getUniqueInstructors(course).length ? null : (
                <div className="instructor-group" key={course.code}>
                  <span className="course-code">{course.code}</span>
                  <CheckGroup
                    name="instructors"
                    values={this.state.instructorFilters}
                    defaultValue={false}
                    onChange={instructorFilters => this.setState({instructorFilters, currentScheduleIndex: 0})}>
                    {getUniqueInstructors(course).filter(i => uniqueInstructors[i]).map(instructor =>
                      <Check key={instructor}
                        value={instructor}
                        text={instructor}
                        hint={uniqueInstructors[instructor] + ' Schedules'}
                      />
                    )}
                  </CheckGroup>
                </div>
              ))}
            </div>

          </div>
          <button className="button button--primary" onClick={this.downloadSchedule}>Download Schedule</button>
        </div>
        <div className="content">
          {schedules.length ? 
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
                </div>
                {Days.map(day =>
                  <div key={day} className="schedule-column">
                    {meets[day].map((meet, i) => <Meet key={meet.crn+i} {...meet}
                      slots={slots[meet.crn]}
                      fade={fadeFullSections && slots[meet.crn] && slots[meet.crn].rem <= 0}
                      color={Colors[crns.indexOf(meet.crn)]}
                      locked={lockedSections.includes(meet.crn)}
                      onClick={() => this.toggleLock(meet.crn)}
                    />)}
                  </div>
                )}
                <div className="export-watermark">
                  <span>miamischeduler.com</span><br/>
                  <span>Generated by Miami Scheduler</span>
                </div>
              </div>
            </div>
          </div> :
          loadingschedules ?
            <div className="schedules-message">
              <div className="spinner"></div>
              <span>Generating Schedules</span>
            </div>
          : 
            <div className="schedules-message">
              <i className="fa fa-ban"></i>
              <span>No Schedules</span>
                {generatedSchedules.length ? 
                  <button className="button button--default" onClick={this.resetFilters}>Reset Filters</button>
                :
                  <Link to="/" className="button button--default">Change Courses</Link>
                }
            </div>
            }
          
        </div>
      </div>
    )
  }

}
