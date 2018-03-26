import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const days = [
  { sm: 'M', md: 'Mon', lg: 'Monday' },
  { sm: 'T', md: 'Tue', lg: 'Tuesday' },
  { sm: 'W', md: 'Wed', lg: 'Wednesday' },
  { sm: 'R', md: 'Thu', lg: 'Thursday' },
  { sm: 'F', md: 'Fri', lg: 'Friday' },
];
const hours = [8, 9, 10, 11 ,12, 1, 2, 3, 4, 5, 6, 7, 8];
const colors = ['#0D47A1', '#B71C1C', '#1B5E20', '#E65100', '#4A148C', '#263238'];

const AppWrapper = styled.div`
  margin-top: 64px;

  @media screen and (min-width: 768px) {
    margin-top: 0;
  }
`

const Container = styled.div`
  max-width: 1280px;
  padding: 0 16px;
  margin: 0 auto;
`

const SplitContainer = Container.extend`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const NavbarWrapper = styled.div`
  position: fixed;
  background: #B61E2E;
  color: #F5F5F5;
  box-shadow: 0 2px 16px rgba(0, 0, 0, .2);
  top: 0;
  left: 0;
  right: 0;
  z-index: 3;

  @media screen and (min-width: 768px) {
    margin-bottom: 16px;
    position: unset;
  }
`

const NavbarLink = styled.a`
  color: #F5F5F5;
  font-size: .875rem;
  line-height: 3rem;
  text-decoration: none;
  outline: none;

  &:hover, &:focus {
    text-decoration: underline;
  }
`

const NavbarBrand = NavbarLink.extend`
  font-size: 1rem;
`

const MobileMenu = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #B61E2E;
  z-index: 2;
  opacity: 0;
  transform: translateY(-100vh);
  will-change: transform;
  transition: transform 0s, opacity 250ms;

  @media screen and (min-width: 768px) {
    display: none;
  }

  ${props => props.open && `
    opacity: 1;
    transform: none;
  `}

  a {
    font-size: 1.25rem;
    line-height: 8rem;
    color: #F5F5F5;
    text-align: center;
    text-decoration: none;
  }
`

const DesktopMenu = styled.nav`
  display: none;
  margin-right: -16px;

  @media screen and (min-width: 768px) {
    display: flex;
  }

  a {
    font-size: .75rem;
    line-height: 3rem;
    color: #F5F5F5;
    text-align: center;
    text-decoration: none;
    padding: 0 16px;
    outline: none;

    &:hover, &:focus {
      text-decoration: underline;
    }

    &.active {
      background: #A51B2A;
    }
  }
`

const MenuButton = styled.button`
  padding: 16px;
  background: transparent;
  border: none;
  border-radius: 0;
  outline: none;
  cursor: pointer;
  margin-right: -16px;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  z-index: 3;

  @media screen and (min-width: 768px) {
    display: none;
  }

  div {
    width: 16px;
    height: 1px;
    background: #FFFFFF;
    transition: transform 150ms linear;
  }

  ${props => props.active ? `
    div:nth-of-type(1) {
      transform: translateY(1px) rotate(45deg);
    }

    div:nth-of-type(2) {
      transform: scaleX(0);
    }

    div:nth-of-type(3) {
      transform: translateY(-1px) rotate(-45deg);
    }
    
  ` : `
    div:nth-of-type(1) {
      transform: translateY(-5px);
    }

    div:nth-of-type(3) {
      transform: translateY(5px);
    }
  `}
`

const Input = styled.input`
  font-size: .875rem;
  padding: 16px;
  padding-left: 48px;
  color: #4A4A4A;
  background: #FFFFFF;
  border: none;
  border-radius: 0;
  outline: none;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, .2);

  &:focus {
    box-shadow: 1px 1px 16px rgba(33, 150, 243, .5)
  }
`

const Select = styled.select`
  font-size: .75rem;
  font-weight: 500;
  padding: 16px;
  color: #4A4A4A;
  background: #FAFAFA;
  border: none;
  border-radius: 0;
  outline: none;
  cursor: pointer;
  appearance: none;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, .2);

  &:focus {
    box-shadow: 1px 1px 16px rgba(33, 150, 243, .5)
  }
`

const Button = styled.button`
  font-size: .875rem;
  font-weight: 500;
  padding: 8px 16px;
  color: #4A4A4A;
  background: #FFFFFF;
  border: none;
  border-radius: 0;
  outline: none;
  cursor: pointer;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, .2);

  &:hover {
    background: #FAFAFA;
  }

  &:active {
    background: #F5F5F5;
  }

  span + i {
    margin-left: 16px;
  }

  i + span {
    margin-left: 16px;
  }

  ${props => props.large && 'padding: 16px;'}

  ${props => props.block && 'width: 100%;'}

  ${props => props.primary && `
    background: #4CAF50;
    color: #F5F5F5;

    &:hover {
      background: #43A047;
    }

    &:active {
      background: #388E3C;
    }
  `}
`

const List = styled.ul`
  background: #FFFFFF;
`

const ListHeader = styled.li`
  background: #37474F;
  color: #F5F5F5;
  padding: 16px;
  text-align: center;
`

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  font-size: .75rem;
  border-bottom: 1px solid #DDDDDD;
`

const SearchFormWrapper = styled.div`
  grid-area: search-form;
  display: flex;
  flex-direction: column;
  position: relative;

  input {
    order: 2;
  }

  select {
    order: 1;
    margin-bottom: 8px;
  }

  i {
    position: absolute;
    pointer-events: none;

    &.fa-search {
      top: 72px;
      left: 16px;
    }

    &.fa-chevron-down {
      font-size: .75rem;
      line-height: 1rem;
      top: 16px;
      right: 16px;
    }
  }

  @media screen and (min-width: 400px) {
    flex-direction: row;

    input {
      order: 1;
      flex: 2;
      width: 100%;
      margin-right: 8px;
    }
  
    select {
      order: 2;
      flex: 1;
      min-width: 160px;
      margin: 0;
    }
  
    i {
      position: absolute;
      pointer-events: none;
  
      &.fa-search {
        top: 16px;
        left: 16px;
      }
  
      &.fa-chevron-down {
        font-size: .75rem;
        top: 16px;
        right: 16px;
      }
    }

  }
`

const SearchResultsWrapper = styled.div`
  grid-area: search-results;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, .2);
  overflow-y: scroll;
  background: #FFFFFF;
  display: ${props => props.show ? 'block' : 'none'};
  margin-top: 8px;
  max-height: 400px;
  
  @media screen and (min-width: 768px) {
    margin: 0;
    display: block;
  }
`

const SelectedCoursesWrapper = styled.div`
  grid-area: selected-courses;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, .2);
  background: #FFFFFF;
  margin-top: 16px;

  @media screen and (min-width: 768px) {
    margin: 0;
  }
`

const CourseSelectorWrapper = styled.div`;

  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-rows: 48px 400px;
    grid-template-columns: 4fr 3fr;
    grid-gap: 8px 16px;
    grid-template-areas:
      "search-form selected-courses"
      "search-results selected-courses";
  }
`

const GenerationStatus = styled.div`
  margin: 32px 0;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 500;
`

const ScheduleNavbarWrapper = styled.div`
  position: fixed;
  bottom: 100%;
  left: 0;
  right: 0;
  padding: 16px 0;
  background: #FAFAFA;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, .2);
  z-index: 4;
  opacity: 0;
  transition: transform 250ms ease-in, opacity 250ms ease-in;
  
  @media screen and (min-width: 1024px) {
    ${props => props.show && `
      opacity: 1;
      transform: translateY(100%);
    `}
  }
`

const CourseLabelList = styled.div`
  display: flex;
`

const CourseLabel = styled.span`
  display: flex;
  align-items: center;
  font-size: .75rem;

  &:before {
    display: block;
    content: "";
    width: 16px;
    height: 16px;
    border-radius: 3px;
    margin-right: 8px;
    background: ${props => props.color || '#4A4A4A'};
  }

  + span {
    margin-left: 16px;
  }
`

const ScheduleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  background: #FFFFFF;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, .2);
  overflow: hidden;
`

const InfoOverlay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #FFFFFF;
  color: #6A6A6A;
  pointer-events: none;
  position: absolute;
  top: -1px;
  bottom: -1px;
  left: -1px;
  right: -1px;
  opacity: 0;
  transition: opacity 250ms ease-in;
  z-index: 3;

  @media screen and (min-width: 1024px) {
    ${ScheduleWrapper}:hover & {
      opacity: .95;
      pointer-events: all;
      cursor: pointer;
    }
  }

  span {
    font-size: 1.25rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 2px;

  }

  i {
    font-size: 3rem;
    margin-bottom: 32px;
  }
`

const ScheduleHeader = styled.div`
  display: flex;
  padding: 16px 8px;
  font-size: .75rem;
  background: #37474F;
  color: #F5F5F5;
  text-align: center;

  i {
    width: 24px;
  }

  span {
    flex: 2;
  }
`

const ScheduleCalendar = styled.div`
  flex: 1;
  box-sizing: border-box;
  display: flex;
  padding: 8px;
  padding-top: 16px;
  position: relative;
  background: #FFFFFF;
`

const ScheduleClock = styled.div`
  display: flex;
  flex-direction: column;
  font-size: .6rem;
  color: #4A4A4A;
  margin-top: -.3rem;
  text-align: center;

  ${ScheduleCalendar} & {
    width: 24px;
  }
  
  span {
    flex: 1;
  }
`

const ScheduleDay = styled.div`
  position: relative;

  ${ScheduleCalendar} & {
    flex: 2;
  }
`

const DetailedSchedule = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
`

const MeetWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: absolute;
  font-size: .5rem;
  top: ${props => props.start}%;
  height: ${props => props.length}%;
  left: 1px;
  right: 1px;
  padding: 4px;
  background: ${props => props.color || '#4A4A4A'};
  color: #F5F5F5;

  span:nth-of-type(3) {
    display: none;
  }

  ${DetailedSchedule} & {
    font-size: .675rem;

    span:nth-of-type(3) {
      display: inline-block;
    }
  }

  span + span {
    margin-top: 4px;
  }
`

const ScheduleGridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 1fr);
  grid-auto-rows: 75vh;
  grid-gap: 8px;

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  }
`

const ScheduleInformation = styled.div`
  display: flex;
  width: 85vw;
  max-width: 1280px;
  height: 85vh;
  max-height: 720px;
`

const ScheduleSidebar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #F5F5F5;
  box-shadow: -2px 0 16px rgba(0, 0, 0, .2) inset;
  max-width: 360px;

  > * + * {
    margin-top: 16px;
  }

  > button {
    margin-top: auto;
  }
`

const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .8);
  z-index: 10;
`

const Modal = styled.div`
  background: #F5F5F5;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, .5);
`

const CourseNumbers = List.extend`
  box-shadow: 2px 2px 16px rgba(0, 0, 0, .2);
`

const CopyTextWrapper = styled.div`
  display: flex;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, .2);
  background: #FFFFFF;

  > span {
    font-size: .75rem;
    flex: 1;
    margin: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const CopyButton = styled.button`
  font-size: .875rem;
  font-weight: 500;
  padding: 8px 16px;
  color: #F5F5F5;
  background: #37474F;
  border: none;
  border-radius: 0;
  outline: none;
  cursor: pointer;
  width: 100px;

  i {
    font-size: .75rem;
    margin-right: 8px;
  }
`

const ModalCloseWrapper = styled.div`
  position: absolute;
  top: 32px;
  right: 32px;
  height: 32px;
  width: 32px;
  cursor: pointer;

  div {
    width: 32px;
    height: 1px;
    background: #FFFFFF;
  }

  div:first-of-type {
    transform: translateY(16px) rotate(45deg);
  }

  div:last-of-type {
    transform: translateY(15px) rotate(-45deg);
  }
`

function ModalClose({ onClose }) {
  return (
    <ModalCloseWrapper onClick={onClose}>
      <div></div>
      <div></div>
    </ModalCloseWrapper>
  )
}

function CopyText({ text }) {
  return (
    <CopyTextWrapper>
      <span>{text}</span>
      <CopyButton>
        <i className="fa fa-clipboard"></i>
        <span>Copy</span>
      </CopyButton>
    </CopyTextWrapper>
  )
}

function CourseNumber({ course, crn, color }) {
  return (
    <CourseNumberWrapper color={color}>
      <span>{crn} - {course.code}</span>
    </CourseNumberWrapper>
  )
}

function Menu({ as: Component, ...rest }) {
  return (
    <Component {...rest}>
      <a href="#" className="active">Schedule Generator</a>
      <a href="#">Instructor Reviews</a>
      <a href="#">Grade Distributions</a>
    </Component>
  )
}

function Navbar({ showMenu, onMenuToggle }) {
  return (
    <NavbarWrapper>
      <SplitContainer>
        <NavbarBrand href="/">Miami Scheduler</NavbarBrand>
        <Menu as={DesktopMenu} />
        <Menu open={showMenu} as={MobileMenu} />
        <MenuToggle active={showMenu} onClick={onMenuToggle} />
      </SplitContainer>
    </NavbarWrapper>
  )
}

function MenuToggle({ active, onClick }) {
  return (
    <MenuButton active={active} onClick={onClick}>
      <div></div>
      <div></div>
      <div></div>
    </MenuButton>
  )
}

function SearchForm({ terms, selectedTerm, searchQuery, onTermChange, onQueryChange, onSearchEnter, onSearchLeave }) { 
  
    return (
      <SearchFormWrapper>
        <Input 
          placeholder="Search Courses" 
          value={searchQuery} 
          onChange={event => onQueryChange(event.target.value)}
          onFocus={onSearchEnter}
          onBlur={onSearchLeave}
        />
        <Select value={selectedTerm} onChange={event => onTermChange(event.target.value)}>
          {terms.map(term => <option key={term.id} value={term.id}>{term.name}</option>)}
        </Select>
        <i className="fa fa-search"></i>
        <i className="fa fa-chevron-down"></i>
      </SearchFormWrapper>
    )
  }

function SearchResults({ showResults, courses, onCourseClick }) {
  return (
    <SearchResultsWrapper show={showResults}>
      <List>
        {courses.map(course => 
          <ListItem key={course.id} onClick={() => onCourseClick(course)}>
            <span>{course.code} - {course.title}</span>
          </ListItem>
        )}
      </List>
    </SearchResultsWrapper>
  )
}

function SelectedCourses({ courses, onCourseClick }) {
  
  const total = courses.reduce((credits, course) => {
    credits.low += course.credits.lecture_low + course.credits.lab_low;
    credits.high += course.credits.lecture_high + course.credits.lab_high;
    return credits;
  }, { low: 0, high: 0});

  const credits = total.low === total.high ? total.low : `${total.low} - ${total.high}`;

  return (
    <SelectedCoursesWrapper>
      <List>
        <ListHeader>{credits} Credits Selected</ListHeader>
        {courses.map(course => 
          <ListItem key={course.id}>
            <span>{course.code} - {course.title}</span>
            <i className="fa fa-close" onClick={() => onCourseClick(course)}></i>
          </ListItem>
        )}
      </List>
    </SelectedCoursesWrapper>
  )
}

function ScheduleNavbar({ show, selectedCourses, showFilters, onFilterToggle }) {
  return (
    <ScheduleNavbarWrapper show={show}>
      <SplitContainer>
        <CourseLabelList>
          {selectedCourses.map((course, i) => <CourseLabel key={course.id} color={colors[i]}>{course.code}</CourseLabel>)}
        </CourseLabelList>
        <Button onClick={onFilterToggle}>
          <span>Filters</span>
          <i className={['fa', showFilters ? 'fa-chevron-up' : 'fa-chevron-down'].join(' ')}></i>
        </Button>
      </SplitContainer>
    </ScheduleNavbarWrapper>
  )
}

function formatTime(time) {
  const h = Math.floor(time / 60);
  const m = time % 60;
  const H = h > 12 ? h - 12 : h;
  const M = ('00'+m).slice(-2);
  return `${H}:${M}`;
}

function ScheduleMeet({ code, name, instructor, start_time, end_time, room, hall, start, length, color }) {
  return (
    <MeetWrapper start={start} length={length} color={color}>
      <span>{code} {name}</span>
      <span>{instructor}</span>
      <span>{formatTime(start_time)} - {formatTime(end_time)} {room} {hall}</span>
    </MeetWrapper>
  )
}

function Schedule({ start_time, end_time, crns, meets, onClick }) {
  return (
    <ScheduleWrapper>
      <InfoOverlay onClick={onClick}>
        <i className="fa fa-info"></i>
        <span>Click for more info</span>
      </InfoOverlay>
      <ScheduleHeader>
        <i className="fa fa-clock-o"></i>
        {days.map(day => <span key={day.sm}>{day.sm}</span>)}
      </ScheduleHeader>
      <ScheduleCalendar>
        <ScheduleClock>
          {hours.map((hour, i) => <span key={i}>{hour}</span>)}
        </ScheduleClock>
        {days.map(day => (
          <ScheduleDay key={day.sm}>
            {meets[day.sm].map((meet, i) => <ScheduleMeet key={day + i} {...meet} instructor={meet.instructors[0] && meet.instructors[0].last_name} start={(meet.start_time - start_time) / (end_time - start_time) * 100} length={(meet.end_time - meet.start_time) / (end_time - start_time) * 100} color={colors[crns.indexOf(meet.crn)]} />)}
          </ScheduleDay>
        ))}
      </ScheduleCalendar>
    </ScheduleWrapper>
  )
}

function ScheduleGrid({ schedules, onScheduleClick }) {
  return (
    <ScheduleGridWrapper>
      {schedules.map(schedule => <Schedule start_time={480} end_time={1200} key={schedule.crns.join('')} {...schedule} onClick={() => onScheduleClick(schedule)} />)}
    </ScheduleGridWrapper>
  )
}

export default class Generator extends Component {

  state = {
    terms: [],
    selectedTerm: '',
    searchQuery: '',
    searchResults: [],
    selectedCourses: [],
    generatedSchedules: [],
    showScheduleNavbar: false,
    showSearchResults: false,
    showMenu: false,
    showFilters: false,
    selectedSchedule: null
  }

  async componentDidMount() {
    this.fetchTerms();
    const { data: { schedules } } = await axios.get('http://beta.miamischeduler.com/api/schedules?courses=201820CSE270M,201820CSE451,201820CSE465,201820ENG313,201820GLG301');
    this.setState({ generatedSchedules: schedules });
    const { data: selectedCourses } = await axios.get('http://beta.miamischeduler.com/api/courses?id=201820CSE270M,201820CSE451,201820CSE465,201820ENG313,201820GLG301');
    this.setState({ selectedCourses });

    window.addEventListener('scroll', () => {
      const { showScheduleNavbar } = this.state;
      if (!showScheduleNavbar && window.scrollY >= this.schedulesContainer.offsetTop) {
        this.setState({ showScheduleNavbar: true });
      } else if (showScheduleNavbar && window.scrollY <= this.schedulesContainer.offsetTop) {
        this.setState({ showScheduleNavbar: false });
      }
    });
  }

  async fetchTerms() {
    const { data } = await axios.get('http://beta.miamischeduler.com/api/terms');
    const defaultTerm = data.find(term => /(Fall|Spring)/.test(term.name));
    this.setState({ terms: data, selectedTerm: defaultTerm.id }, this.searchCourses);
  }

  async searchCourses() {
    const { selectedTerm } = this.state;
    const { data } = await axios.get(`http://beta.miamischeduler.com/api/courses/search?term=${selectedTerm}`);
    this.setState({ searchResults: data });
  }
  
  handleCourseSelect = (course) => {
    const { selectedCourses } = this.state;
    if (selectedCourses.length >= 8 || selectedCourses.includes(course)) return;
    
    this.setState({ selectedCourses: [...selectedCourses, course] });
  }

  handleCourseDeselect = (course) => {
    const { selectedCourses } = this.state;
    this.setState({ selectedCourses: selectedCourses.filter(selectedCourse => selectedCourse.id !== course.id) });
  }

  render() {
    return (
      <AppWrapper>
        <Navbar
          showMenu={this.state.showMenu}
          onMenuToggle={() => this.setState(state => ({ showMenu: !state.showMenu }))}
        />
        <Container>
          <CourseSelectorWrapper>
            <SearchForm 
              terms={this.state.terms}
              selectedTerm={this.state.selectedTerm}
              searchQuery={this.state.searchQuery}
              onTermChange={selectedTerm => this.setState({ selectedTerm }, this.searchCourses)}
              onQueryChange={searchQuery => this.setState({ searchQuery })}
              onSearchEnter={() => this.setState({ showSearchResults: true })}
              onSearchLeave={() => setTimeout(() => this.setState({ showSearchResults: false }), 100)}
            />
            <SearchResults
              showResults={this.state.showSearchResults}
              courses={this.state.searchResults}
              onCourseClick={this.handleCourseSelect}
            />
            <SelectedCourses
              courses={this.state.selectedCourses}
              onCourseClick={this.handleCourseDeselect}
            />
          </CourseSelectorWrapper>
        </Container>
        <ScheduleNavbar
          show={this.state.showScheduleNavbar}
          selectedCourses={this.state.selectedCourses} 
          numColumns={this.state.numColumns}
          showFilters={this.state.showFilters}
          onFilterToggle={() => this.setState(state => ({ showFilters: !state.showFilters }))}
        />
        <Container>
          <GenerationStatus>
            <span ref={ref => this.schedulesContainer = ref}>{this.state.generatedSchedules.length} Schedules Generated</span>
          </GenerationStatus>
          <ScheduleGrid 
            schedules={this.state.generatedSchedules}
            onScheduleClick={selectedSchedule => this.setState({ selectedSchedule })}
          />
        </Container>
        {this.state.selectedSchedule && (
          <ModalContainer>
            <ModalClose onClose={() => this.setState({ selectedSchedule: null })} />
            <ScheduleInformation>
              <DetailedSchedule>
                <ScheduleHeader>
                  {days.map(day => <span key={day.sm}>{day.lg}</span>)}
                </ScheduleHeader>
                <ScheduleCalendar>
                  {days.map(day => (
                    <ScheduleDay key={day.sm}>
                      {this.state.selectedSchedule.meets[day.sm].map((meet, i) => <ScheduleMeet key={day + i} {...meet} instructor={meet.instructors[0] && `${meet.instructors[0].first_name} ${meet.instructors[0].last_name}`} start={(meet.start_time - 480) / 720 * 100} length={(meet.end_time - meet.start_time) / 720 * 100} color={colors[this.state.selectedSchedule.crns.indexOf(meet.crn)]} />)}
                    </ScheduleDay>
                  ))}
                </ScheduleCalendar>
              </DetailedSchedule>
              <ScheduleSidebar>
                <CopyText text="https://miamischeduler.com/schedule/2018CSE201A,2018CSE201A,2018CSE201A" />
                <CourseNumbers>
                  <ListHeader>Course Numbers</ListHeader>
                  {this.state.selectedSchedule.crns.map((crn, i) => (
                    <ListItem>
                      <span>{this.state.selectedCourses[i].code} A</span>
                      <span>{crn}</span>
                    </ListItem>
                  ))}
                </CourseNumbers>
                <Button primary block large>
                  <span>Download Schedule</span>
                  <i className="fa fa-download"></i>
                </Button>
              </ScheduleSidebar>
            </ScheduleInformation>
          </ModalContainer>
        )}
      </AppWrapper>
    );
  }
}