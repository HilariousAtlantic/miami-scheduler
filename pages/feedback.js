import React, { Component } from 'react';
import styled from 'styled-components';

import { Navbar } from '../components';

const FeedbackWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  text-align: center;

  > span {
    line-height: 64px;
  }
`;

export default function() {
  return (
    <FeedbackWrapper>
      <Navbar activeLink="feedback" />
      <span>
        This page isn't finished yet, but feel free to email us at
        hilariousatlantic@gmail.com for any feedback!
      </span>
    </FeedbackWrapper>
  );
}
