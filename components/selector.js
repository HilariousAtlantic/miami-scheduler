import React, { Component } from 'react';
import styled, { css } from 'styled-components';

const SelectorWrapper = styled.div`
  position: relative;
  background: #fff;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);

  select {
    font-size: 12px;
    font-weight: 500;
    padding: 12px;
    padding-top: 13px;
    padding-right: 40px;
    color: #4a4a4a;
    background: inherit;
    border: none;
    border-radius: 0;
    outline: none;
    cursor: pointer;
    appearance: none;
  }

  .fa-angle-down {
    position: absolute;
    pointer-events: none;
    font-size: 0.8rem;
    line-height: 1rem;
    top: 12px;
    right: 16px;
  }

  ${props => props.inline && inline};
`;

const Label = styled.label`
  background: #f5f5f5;
  color: #4a4a4a;
  padding: 12px 24px;
  font-size: 12px;
  font-weight: 500;
`;

const inline = css`
  height: 32px;
  background: #f5f5f5;
  box-shadow: none;

  select {
    font-size: 12px;
    padding: 9px 8px;
    padding-right: 24px;
  }

  .fa-angle-down {
    top: 8px;
    right: 8px;
    font-size: 0.75rem;
  }
`;

export function InlineSelector(props) {
  return <Selector {...props} inline />;
}

export function Selector({
  label,
  options,
  selectedOption,
  onSelectOption,
  inline
}) {
  return (
    <SelectorWrapper inline={inline}>
      {label && <Label>{label}</Label>}
      <select
        defaultValue={selectedOption}
        onChange={event => onSelectOption(event.target.value)}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
      <i className="fa fa-angle-down" />
    </SelectorWrapper>
  );
}
