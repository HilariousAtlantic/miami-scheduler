import React, { Component } from 'react'
import { bool, object, func } from 'prop-types'

export const Check = ({
  checked,
  value,
  text,
  hint,
  name,
  onChange
}) => {
  return (
    <div className='form-checkbox'>
      <label>
        <input
          type='checkbox'
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value, !checked)}
        />
        <span>{text}</span>
      </label>
      {hint && <p className='note'>
        {hint}
      </p>}
    </div>
  )
}

export class CheckGroup extends Component {

  static propTypes = {
    defaultValue: bool,
    values: object.isRequired,
    onChange: func.isRequired
  }

  static defaultProps = {
    defaultValue: false
  }

  render() {
    const { name, values, onChange, children, defaultValue } = this.props;
    const checkboxes = children.map(child => React.cloneElement(child, {
      name: name,
      checked: values.hasOwnProperty(child.props.value) ? values[child.props.value] : defaultValue,
      onChange: (value, checked) => onChange(Object.assign({}, values, {[value]: checked}))
    }));

    return (
      <div className='check-group'>
        {checkboxes}
      </div>
    )
  }
}