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
  padding: 16px;
`;

export const Button = styled.button`
  background: #ffffff;
  border: none;
  color: #4a4a4a;
  padding: 8px;
  font-size: 12px;
  outline: none;

  svg + span {
    margin-left: 8px;
  }

  span + svg {
    margin-left: 16px;
  }

  ${props => props.raised && raised};
  ${props => props.danger && danger};
  ${props => props.selected && selected};
  ${props => props.large && large};
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