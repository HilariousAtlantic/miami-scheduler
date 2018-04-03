import { createStore } from './relook';

import initialState from './state';
import * as actionCreators from './actions';

export const { StoreProvider, StoreConsumer, withStore } = createStore(
  initialState,
  actionCreators
);
