import { ADMIN_TOKEN } from '../actions/index.js'

const initialState = {
  token: 'something-random'
}

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADMIN_TOKEN:
      return {
        ...state,
        token: action.payload
      }
    default:
      return state
  }
}

export default adminReducer
