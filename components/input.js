import React, { Component } from 'react';
import styled from 'styled-components';

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
`;

export const TimeInput = Input.extend`
  width: 72px;
  text-align: center;
`;

export const NumberInput = Input.extend`
  width: 40px;
  text-align: center;
`;

const CheckboxInput = styled.input`
  margin: 16px 8px;
`;

export function Checkbox(props) {
  return <CheckboxInput type="checkbox" />;
}
