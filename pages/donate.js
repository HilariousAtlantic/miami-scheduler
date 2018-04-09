import React, { Component } from 'react';
import styled from 'styled-components';

import { Navbar } from '../components';

const DonatePageWrapper = styled.div`
  min-height: 100vh;
`;

const SplitContainer = styled.div`
  width: 90%;
  max-width: 960px;
  margin: 64px auto;
  display: flex;

  section {
    flex: 1;
    padding: 32px;
  }

  h1 {
    font-weight: 500;
  }

  h2 {
    font-weight: 500;
    color: #3d95ce;
  }

  p {
    line-height: 1.6;
  }

  li {
    line-height: 1.6;
  }

  .venmo-screenshot {
    max-width: 400px;
    box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);
  }
`;

export default function() {
  return (
    <DonatePageWrapper>
      <Navbar activeLink="donate" />
      <SplitContainer>
        <section>
          <h1>Every donation helps!</h1>
          <p>
            We pay for the domain and the hosting out of our own pocket,
            averaging around <strong>$5 per month</strong> in addition to the
            hours of blood, sweat, and tears put into this project.
          </p>
          <p>
            Of course, we wanted to do this regardless of the cost, but it would
            be awesome if this could pay for itself and maybe a beer or two!
          </p>
          <h2>Donators</h2>
          <ul>
            <li>Ryan - $5</li>
            <li>Bianca - $5</li>
            <li>Neal - $1</li>
          </ul>
        </section>
        <section>
          <img
            className="venmo-screenshot"
            src="/static/venmo_screenshot.jpg"
          />
        </section>
      </SplitContainer>
    </DonatePageWrapper>
  );
}
