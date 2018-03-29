import React, { Component } from 'react';
import styled from 'styled-components';

const SelectorWrapper = styled.div`
  position: relative;

  i {
    position: absolute;
    pointer-events: none;
    font-size: 0.75rem;
    line-height: 1rem;
    top: 8px;
    right: 8px;
  }
`;

const Select = styled.select`
  font-size: 12px;
  font-weight: 500;
  padding: 8px;
  padding-right: 32px;
  color: #4a4a4a;
  background: #fff;
  border: none;
  border-radius: 0;
  outline: none;
  cursor: pointer;
  appearance: none;
`;

export function Selector({ options, selectedOption, onSelectOption }) {
  return (
    <SelectorWrapper>
      <Select
        defaultValue={selectedOption}
        onChange={event => onSelectOption(event.target.value)}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </Select>
      <i className="fa fa-angle-down" />
    </SelectorWrapper>
  );
}
