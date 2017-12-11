import { createStore, compose } from 'redux'
import socketActions from '../socket/actions'
import { combineReducers } from 'redux'
import reducers from './reducers'

const makeStore = (initialState, enhancers = []) => {
  const rootReducer = combineReducers(reducers)
  const composeEnhancers = (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  const store = createStore(rootReducer, initialState, composeEnhancers(...[ ...enhancers]))

  socketActions(store)

  return store
}

export default makeStore
