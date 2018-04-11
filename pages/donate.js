import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Head from 'next/head';

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

const List = styled.ul``;

const ListItem = styled.li`
  display: flex;
  list-style: none;
  margin-bottom: 8px;

  span:first-of-type {
    flex: 1;
  }

  span:last-of-type {
    min-width: 200px;
  }
`;

export default class DonationPage extends Component {
  state = {
    donations: []
  };

  async componentDidMount() {
    const { data } = await axios.get('/api/donations');
    this.setState({
      donations: data.donations
    });
  }

  render() {
    return (
      <DonatePageWrapper>
        <Head>
          <meta
            name="description"
            content="You can support us by sending over some pocket change to help pay for server hosting and the occasional beer."
          />
        </Head>
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
              Of course, we wanted to do this regardless of the cost, but it
              would be awesome if this could pay for itself and maybe a beer or
              two!
            </p>
            <h2>Donators</h2>
            <List>
              {this.state.donations.map(donation => (
                <ListItem key={donation.id}>
                  <span>{donation.name}</span>
                  <span>${parseFloat(donation.amount).toFixed(2)}</span>
                </ListItem>
              ))}
            </List>
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
}
