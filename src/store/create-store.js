import { createStore, compose, combineReducers } from 'redux'
import socketActions from '../socket/actions.js'
import reducer from './reducers/index.js'

const makeStore = (preloadedState, enhancers = []) => {
  const rootReducer = combineReducers(reducer)
  const composeEnhancers = (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  const store = createStore(rootReducer, preloadedState, composeEnhancers(...[...enhancers]))

  socketActions(store)

  return store
}

export default makeStore
