import React, { Component } from 'react';
import styled from 'styled-components';

import { Navbar } from '../components';

const DonateWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  text-align: center;

  > span {
    line-height: 64px;
  }
`;

export default function() {
  return (
    <DonateWrapper>
      <Navbar activeLink="donate" />
      <span>
        This page isn't finished yet, but feel free to donate to us through
        Venmo @lukeartnak. Every quarter helps!
      </span>
    </DonateWrapper>
  );
}
