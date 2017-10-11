import React, { Component } from 'react'
import { bool, array, func } from 'prop-types'

export const Check = ({...props, children, value, hint, name, onChange, values}) => {
  return (
    <div className='form-checkbox'>
      <label>
        <input
          type='checkbox'
          name={name}
          value={value}
          checked={values[value]}
          onChange={() => {
            values[value] = !values[value]
            onChange(values)
          }} />
        <span>{children}</span>
      </label>
      {hint && <p className='note'>
        {hint}
      </p>}
    </div>
  )
}

export class CheckGroup extends Component {
  constructor(props) {
    super(props)
    let values = {}
    props.values.forEach(value => {
      values[value] = this.props.defaultValue
    })
    this.state = {values}
  }

  static defaultProps =  {
    defaultValue: true
  }

  static propTypes = {
    defaultValue: bool,
    values: array.isRequired,
    onChange: func.isRequired
  }

  renderChildren() {
    const {values} = this.state
    const {children, name, onChange, defaultValue} = this.props
    return React.Children.map(children, child =>
      React.cloneElement(child, {name, onChange, values}))
  }

  render() {
    return (
      <div className='radio-group'>
        {this.renderChildren()}
      </div>
    )
  }
}