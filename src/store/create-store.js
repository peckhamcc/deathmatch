import { createStore, compose } from 'redux'
import socketActions from '../socket/actions'

const makeStore = (rootReducer, initialState, enhancers = []) => {
  const composeEnhancers = (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  const store = createStore(rootReducer, initialState, composeEnhancers(...[ ...enhancers]))

  socketActions(store)

  return store
}

export default makeStore
