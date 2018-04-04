import React, { Component } from 'react';

function logAction(key, update) {
  const name = key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());

  console.log(
    `%c${new Date().toLocaleTimeString()} %c${name}`,
    'color: #BDBDBD',
    'color: #2E7D32; font-weight: bold',
    update
  );
}

function cacheState(state, cachedKeys) {
  try {
    localStorage.setItem(
      'generatorState',
      JSON.stringify(
        cachedKeys.reduce((cache, key) => {
          return {
            ...cache,
            [key]: state[key]
          };
        }, {})
      )
    );
  } catch (e) {}
}

function createActions(actionCreators) {
  return Object.keys(actionCreators).reduce((actions, key) => {
    return {
      ...actions,
      [key]: actionCreators[key](
        () => this.state,
        update =>
          new Promise((resolve, reject) => {
            this.setState(
              state => {
                if (typeof update === 'function') {
                  update = update(state);
                }
                logAction(key, update);
                return update;
              },
              () => {
                resolve();
              }
            );
          }),
        () => this.actions
      )
    };
  }, {});
}

export function createStore(initialState, actionCreators, cachedKeys) {
  const { Provider, Consumer } = React.createContext();

  class StoreProvider extends Component {
    state = initialState;
    actions = createActions.call(this, actionCreators);
    cachedKeys = cachedKeys;

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
