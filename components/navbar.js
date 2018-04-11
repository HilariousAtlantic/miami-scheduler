import React, { Component, Fragment } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const NavbarWrapper = styled.header`
  width: 90%;
  max-width: 1280px;
  margin: 32px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled.a`
  color: #2a2a2a;
  text-decoration: none;
  font-weight: 400;
  font-size: 24px;
`;

const Links = styled.nav`
  display: flex;
  align-items: center;
  font-size: 14px;

  a {
    color: #2a2a2a;
    text-decoration: none;
    padding: 8px 0;
    cursor: pointer;

    &.active {
      border-bottom: 2px solid rgb(183, 28, 28);
    }
  }

  a + a {
    margin-left: 24px;
  }

  @media screen and (max-width: 480px) {
    a:not(:last-of-type) {
      display: none;
    }
  }
`;

const DonateButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: 2px solid #3d95ce;
  border-radius: 50px;
  padding: 12px 24px;
  color: #3d95ce;
  font-weight: 900;
  font-size: 12px;
  cursor: pointer;
  text-decoration: none;
  outline: none;

  &:hover {
    background: #3d95ce;
    color: #fff;

    svg {
      fill: #fff;
    }
  }

  svg {
    fill: #3d95ce;
    height: 16px;
    margin-right: 8px;
  }
`;

const VenmoIcon = (
  <i
    dangerouslySetInnerHTML={{
      __html: `
        <?xml version="1.0" encoding="utf-8"?>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 162 162" style="enable-background:new 0 0 162 162;" xml:space="preserve">
          <path d="M136.8,14.9c4.8,8,7,16.2,7,26.6c0,33.2-28.3,76.2-51.3,106.5H40L19,22.1l46-4.4l11.1,89.6c10.4-16.9,23.2-43.6,23.2-61.7c0-9.9-1.7-16.7-4.4-22.3L136.8,14.9z"/>
        </svg>
      `
    }}
  />
);

export function Navbar({ activeLink }) {
  return (
    <NavbarWrapper>
      <Link href="/" prefetch>
        <Brand href="">Miami Scheduler</Brand>
      </Link>
      <Links>
        <Link href="/" prefetch>
          <a className={activeLink === 'generator' ? 'active' : ''}>
            Schedule Generator
          </a>
        </Link>
        <Link href="/feedback" prefetch>
          <a className={activeLink === 'feedback' ? 'active' : ''}>
            Send Feedback
          </a>
        </Link>
        <Link href="/donate" prefetch>
          <a>
            <DonateButton>
              {VenmoIcon}
              <span>Donate</span>
            </DonateButton>
          </a>
        </Link>
      </Links>
    </NavbarWrapper>
  );
}
