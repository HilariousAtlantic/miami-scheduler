import React, { Component } from 'react';
import styled from 'styled-components';

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  font-size: 12px;
  padding: 8px;
  color: #4a4a4a;
  background: #ffffff;
  border: none;
  border-radius: 0;
  outline: none;
  border-bottom: 2px solid #4a4a4a;
`;

export const TimeInput = Input.extend`
  width: 80px;
`;

export const NumberInput = Input.extend`
  width: 40px;
  text-align: center;
`;
