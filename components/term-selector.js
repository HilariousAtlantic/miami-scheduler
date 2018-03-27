import React, { Component } from 'react';
import styled from 'styled-components';

import { StoreConsumer } from '../store';

const TermSelectorWrapper = styled.div`
  position: relative;

  i {
    position: absolute;
    pointer-events: none;
    font-size: 0.75rem;
    line-height: 1rem;
    top: 16px;
    right: 16px;
  }
`;

const Select = styled.select`
  width: 100%;
  height: 48px;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 16px;
  color: #4a4a4a;
  background: #fafafa;
  border: none;
  border-radius: 0;
  outline: none;
  cursor: pointer;
  appearance: none;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);

  &:focus {
    box-shadow: 1px 1px 16px rgba(33, 150, 243, 0.5);
  }
`;

function TermSelector({ terms, selectedTerm, onSelectTerm }) {
  return (
    <TermSelectorWrapper>
      <Select
        onChange={event => onSelectTerm(event.target.value)}
        defaultValue={selectedTerm}
      >
        {terms.map(term => (
          <option key={term.code} value={term.code}>
            {term.name}
          </option>
        ))}
      </Select>
      <i className="fa fa-chevron-down" />
    </TermSelectorWrapper>
  );
}

export function TermSelectorContainer() {
  return (
    <StoreConsumer>
      {(state, actions) => (
        <TermSelector
          terms={state.terms}
          selectedTerm={state.selectedTerm}
          onSelectTerm={term => actions.selectTerm(term)}
        />
      )}
    </StoreConsumer>
  );
}
