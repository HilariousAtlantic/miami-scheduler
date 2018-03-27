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

export function createStore(initialState, actions) {
  const { Provider, Consumer } = React.createContext();

  class StoreProvider extends Component {
    state = initialState;

    actions = Object.keys(actions).reduce((acc, key) => {
      return {
        ...acc,
        [key]: async function() {
          const logger = createActionLogger(key);
          let result = actions[key].apply(this, Array.from(arguments));
          if (result.then) {
            result = await result;
          }
          if (typeof result === 'object') {
            this.setState(() => {
              logger(result);
              return result;
            });
          } else if (typeof result === 'function') {
            this.setState(state => {
              logger(result(state));
              return result(state);
            });
          } else {
            console.error('action must return an object or function');
          }
          return;
        }.bind(this)
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
