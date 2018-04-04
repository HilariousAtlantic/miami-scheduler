import React, { Component } from 'react';
import styled, { css } from 'styled-components';

const time = css`
  width: 72px;
  text-align: center;
  text-transform: uppercase;
`;

const number = css`
  width: 40px;
  text-align: center;
`;

const error = css`
  background: #ffcdd2;
  color: #b71c1c;
`;

export const Input = styled.input`
  width: 100%;
  height: 32px;
  box-sizing: border-box;
  font-size: 12px;
  padding: 8px;
  color: #4a4a4a;
  background: #f5f5f5;
  border: none;
  border-radius: 0;
  outline: none;

  ${props => props.time && time};
  ${props => props.number && number};
  ${props => props.error && error};
`;

export class TimeInput extends Component {
  state = {
    error: false
  };

  handleChange = event => {
    const { value } = event.target;
    if (value.match(/((([1-9])|(1[0-2])):([0-5])(0|5)\s(A|P|a|p)(M|m))/)) {
      this.props.onChange(value.toUpperCase());
      this.setState({ error: false });
    } else {
      this.setState({ error: true });
    }
  };

  render() {
    return (
      <Input
        placeholder="10:00 AM"
        defaultValue={this.props.value}
        onChange={this.handleChange}
        error={this.state.error}
        time
      />
    );
  }
}

export class NumberInput extends Component {
  state = {
    error: false
  };

  handleChange = event => {
    const { value } = event.target;
    if (value.match(/\d+/)) {
      this.props.onChange(parseInt(value));
      this.setState({ error: false });
    } else {
      this.setState({ error: true });
    }
  };

  render() {
    return (
      <Input
        placeholder="3"
        defaultValue={this.props.value}
        onChange={this.handleChange}
        error={this.state.error}
        number
      />
    );
  }
}
