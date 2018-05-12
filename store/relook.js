import React, { Component } from 'react';

const peristance = {};

function createLogger(key) {
  const name = key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
  return function logger(update) {
    console.log(
      `%c${new Date().toLocaleTimeString()} %c${name}`,
      'color: #BDBDBD',
      'color: #2E7D32; font-weight: bold',
      update
    );
  };
}

function createActions(actionCreators, enableLogging) {
  return Object.keys(actionCreators).reduce((actions, key) => {
    const logger = createLogger(key);
    return {
      ...actions,
      [key]: actionCreators[key](
        update =>
          new Promise((resolve, reject) => {
            this.setState(
              state => {
                if (typeof update === 'function') {
                  update = update(state);
                }
                if (enableLogging) logger(update);
                return update;
              },
              () => {
                peristance.state = this.state;
                resolve();
              }
            );
          }),
        () => this.state,
        () => this.actions
      )
    };
  }, {});
}

const defaultConfig = {
  enableLogging: false
};

export function createStore(
  initialState,
  actionCreators,
  config = defaultConfig
) {
  const { Provider, Consumer } = React.createContext();
  console.log('creating store');

  class StoreProvider extends Component {
    state = peristance.state || initialState;
    actions = createActions.call(this, actionCreators, config.enableLogging);

    render() {
      const store = { state: this.state, actions: this.actions };
      return <Provider value={store}>{this.props.children}</Provider>;
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

  function consume(mapStoreToProps) {
    return WrappedComponent => props => (
      <Consumer>
        {({ state, actions }) => (
          <WrappedComponent {...mapStoreToProps(state, actions)} {...props} />
        )}
      </Consumer>
    );
  }

  return { StoreProvider, StoreConsumer, consume };
}
