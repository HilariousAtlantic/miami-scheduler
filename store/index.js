import { createStore } from './relook';

import state from './state';
import actions from './actions';

export const { StoreProvider, StoreConsumer, withStore } = createStore(
  state,
  actions
);
