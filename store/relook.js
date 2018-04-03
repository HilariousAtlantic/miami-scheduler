import React, { Component } from 'react';

function createActionLogger(key) {
  const name = key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());

  return function(result) {
    console.log(
      `%c${new Date().toLocaleTimeString()} %c${name}`,
      'color: #BDBDBD',
      'color: #2E7D32; font-weight: bold',
      result
    );
  };
}

export function createStore(initialState, actionCreators) {
  const { Provider, Consumer } = React.createContext();

  class StoreProvider extends Component {
    state = initialState;

    actions = Object.keys(actionCreators).reduce((acc, key) => {
      return {
        ...acc,
        [key]: actionCreators[key](
          () => this.state,
          update =>
            this.setState(
              state => (typeof update === 'function' ? update(state) : update)
            )
        )
      };
    }, {});

    render() {
      const store = { state: this.state, actions: this.actions };
      return <Provider value={store}>{this.props.children()}</Provider>;
    }
  }

  class StoreConsumer extends Component {
    render() {
      return (
        <Consumer>
          {({ state, actions }) => this.props.children(state, actions)}
        </Consumer>
      );
    }
  }

  function withStore(WrappedComponent) {
    return function ComponentWithStore(props) {
      return (
        <Consumer>
          {({ state, actions }) => (
            <WrappedComponent store={{ state, actions }} {...props} />
          )}
        </Consumer>
      );
    };
  }

  return { StoreProvider, StoreConsumer, withStore };
}
