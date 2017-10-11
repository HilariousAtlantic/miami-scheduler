import React, { Component } from 'react'
import { object } from 'prop-types'

export const Radio = ({...props, value, hint, children}, context) => {
  const {name, selectedValue, onChange} = context.radioGroup
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

Radio.contextTypes = {
  radioGroup: object
}

export class RadioGroup extends React.Component {
  getChildContext() {
    const {name, selectedValue, onChange} = this.props
    return {
      radioGroup: { name, selectedValue, onChange }
    }
  }

  render() {
    const {children} = this.props
    return (
      <div className='radio-group'>
        {children}
      </div>
    )
  }
}

RadioGroup.childContextTypes = {
  radioGroup: object
}
