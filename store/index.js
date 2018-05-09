import { createStore } from './relook';

import initialState from './state';
import * as actionCreators from './actions';

export const { StoreProvider, StoreConsumer, consume } = createStore(
  initialState,
  actionCreators,
  {
    enableLogging: true
  }
);
