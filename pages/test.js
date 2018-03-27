import React, { Component } from 'react';
import styled from 'styled-components';

import { StoreProvider, withStore } from '../store';
import { TermSelectorContainer, CourseSearchContainer } from '../components';

class Test extends Component {
  componentWillMount() {
    const { actions } = this.props.store;
    actions.fetchTerms();
  }

  render() {
    return (
      <div>
        <TermSelectorContainer />
        <CourseSearchContainer />
      </div>
    );
  }
}

const TestWithStore = withStore(Test);

export default class extends Component {
  render() {
    return <StoreProvider>{() => <TestWithStore />}</StoreProvider>;
  }
}
