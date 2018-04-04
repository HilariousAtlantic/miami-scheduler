import React, { Component } from 'react';
import styled, { css } from 'styled-components';

const raised = css`
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);
`;

const danger = css`
  color: #b71c1c;
`;

const selected = css`
  padding-bottom: 6px;
  border-bottom: 2px solid #4a4a4a;
`;

const large = css`
  padding: 12px 16px;
`;

const primary = css`
  background: #4caf50;
  color: #e8f5e9;

  &:hover {
    background: #43a047;
  }

  &:active {
    background: #388e3c;
  }
`;

const disabled = css`
  opacity: 0.5;
`;

export const Button = styled.button`
  background: #ffffff;
  border: none;
  color: #4a4a4a;
  padding: 8px;
  font-size: 12px;
  outline: none;
  cursor: pointer;

  &:hover {
    background: #fafafa;
  }

  &:active {
    background: #fafafa;
  }

  i + span {
    margin-left: 16px;
  }

  span + i {
    margin-left: 16px;
  }

  ${props => props.raised && raised};
  ${props => props.danger && danger};
  ${props => props.selected && selected};
  ${props => props.large && large};
  ${props => props.primary && primary};
  ${props => props.disabled && disabled};
`;

export function IconButton({ leftIcon, rightIcon, children, ...props }) {
  return (
    <Button {...props}>
      {leftIcon && <i className={`fa fa-${leftIcon}`} />}
      {children && <span>{children}</span>}
      {rightIcon && <i className={`fa fa-${rightIcon}`} />}
    </Button>
  );
}

const DayButton = Button.extend`
  height: 32px;
  width: 32px;
  background: #f5f5f5;
  font-size: 12px;
`;

const DayPickerWrapper = styled.div`
  display: flex;
  align-items: center;
`;

function toggleDay(day, days) {
  if (days.includes(day)) {
    return days.filter(d => d !== day);
  } else {
    return [...days, day];
  }
}

export function DayPicker({ selectedDays, onChange }) {
  return (
    <DayPickerWrapper>
      {['M', 'T', 'W', 'R', 'F'].map(day => (
        <DayButton
          key={day}
          onClick={() => onChange(toggleDay(day, selectedDays))}
          selected={selectedDays.includes(day)}
        >
          {day}
        </DayButton>
      ))}
    </DayPickerWrapper>
  );
}
