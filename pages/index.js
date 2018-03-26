import React, { Component } from 'react';
import styled from 'styled-components';

const Header = styled.header`
  background-color: #B61E2E;
  background-image: url(/static/bg_header.png);
  color: #F5F5F5;
  font-size: 1.5rem;
  margin-bottom: 400px;
`

const Navbar = styled.div`
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  padding: 32px;

  a {
    color: #FFFFFF;
    text-decoration: none;
    font-size: 1rem;
    padding: 0 16px;

    &:hover {
      text-decoration: underline;
    }
  }
`

const Tagline = styled.h1`
  font-weight: 500;
  margin-top: 48px;
`

const TryButton = styled.a`
  display: inline-block;
  background: #F5F5F5;
  color: #4A4A4A;
  padding: 16px 32px;
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 2px;
  border-radius: 3px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, .15);
`

const SampleImage = styled.img`
  flex: 1;
  max-width: 600px;
`

const HeaderBlurb = styled.div`
  flex: 1;
`

const HorizontalFlex = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 64px;
`

export default class Index extends Component {
  render() {
    return <div>
      <Header>
        <Navbar>
          <span>Miami Scheduler</span>
          <nav>
            <a href="#">Schedule Generator</a>
            <a href="#">Instructor Reviews</a>
            <a href="#">Grade Distributions</a>
          </nav>
        </Navbar>
        <HorizontalFlex>
          <HeaderBlurb>
            <Tagline>Scheduling made easier</Tagline>
            <p>Pick your courses and we do the rest.</p>
            <TryButton>Try it now</TryButton>
          </HeaderBlurb>
          <SampleImage src="/static/img_sample.png" />
        </HorizontalFlex>
      </Header>
      
    </div>
    
  }
}
