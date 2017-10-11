import React, { Component } from 'react'

export const Radio = ({...props, children, value, hint, name, selectedValue, onChange}) => {
  return (
    <div className='form-checkbox'>
      <label>
        <input
          type='radio'
          name={name}
          value={value}
          onChange={onChange}
          checked={value === selectedValue} />
        <span>{children}</span>
      </label>
      {hint && <p className='note'>
        {hint}
      </p>}
    </div>
  )
}

export class RadioGroup extends React.Component {
  renderChildren() {
    const {children, name, onChange, selectedValue} = this.props
    return React.Children.map(children, child =>
      React.cloneElement(child, {name, selectedValue, onChange}))
  }

  render() {
    return (
      <div className='radio-group'>
        {this.renderChildren()}
      </div>
    )
  }
}
