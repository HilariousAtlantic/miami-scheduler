import React, { Component } from 'react';
import styled, { css } from 'styled-components';

const Raised = css`
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);
`;

const Danger = css`
  color: #b71c1c;
`;

const Selected = css`
  border-bottom: 2px solid #4a4a4a;
`;

export const Button = styled.button`
  background: #fff;
  border: none;
  color: #4a4a4a;
  padding: 16px;
  font-size: 12px;
  outline: none;

  * + * {
    margin-left: 8px;
  }

  ${props => props.raised && Raised};
  ${props => props.danger && Danger};
  ${props => props.selected && Selected};
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
  padding: 8px;
`;

const DayPickerWrapper = styled.div``;

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
          onClick={() => onChange(toggleDay(day, selectedDays))}
          selected={selectedDays.includes(day)}
        >
          {day}
        </DayButton>
      ))}
    </DayPickerWrapper>
  );
}
