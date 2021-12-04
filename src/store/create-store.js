import { createStore, compose, combineReducers } from 'redux'
import socketActions from '../socket/actions.js'
import reducers from './reducers/index.js'

const makeStore = (initialState, enhancers = []) => {
  const rootReducer = combineReducers(reducers)
  const composeEnhancers = (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  const store = createStore(rootReducer, initialState, composeEnhancers(...[...enhancers]))

  socketActions(store)

  return store
}

export default makeStore
