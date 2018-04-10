import React, { Component } from 'react';
import styled from 'styled-components';

import { StoreConsumer } from '../store';

const colors = [
  '#0D47A1',
  '#B71C1C',
  '#1B5E20',
  '#E65100',
  '#4A148C',
  '#006064',
  '#263238'
];

const HelpMessage = styled.span`
  opacity: 0;
  font-size: 14px;
  line-height: 28px;
  transition: opacity 200ms ease-in;
`;

const SectionListWrapper = styled.div`
  margin-top: 8px;

  &:hover ${HelpMessage} {
    opacity: 1;
  }
`;

const List = styled.ul`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 40px;
  grid-gap: 8px;
`;

const ListItem = styled.li`
  display: flex;
  list-style: none;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  background: ${props => props.color || '#4a4a4a'};
  padding: 16px;
  font-size: 12px;
  font-weight: 500;
  opacity: ${props => (props.loading ? 0.5 : 1)};
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);

  i {
    cursor: pointer;
  }
`;

export function SectionList({ sections, lockedSections, onSelectSection }) {
  return (
    <SectionListWrapper>
      <List>
        {sections.map((section, i) => (
          <ListItem key={section.crn} color={colors[i]}>
            <span>{section.title}</span>
            <i
              className={`fa fa-${
                lockedSections.includes(section.crn) ? 'lock' : 'lock-open'
              }`}
              onClick={() => onSelectSection(section)}
            />
          </ListItem>
        ))}
      </List>
      <HelpMessage>
        Locking a section will filter out schedules that do not have that
        section.
      </HelpMessage>
    </SectionListWrapper>
  );
}
