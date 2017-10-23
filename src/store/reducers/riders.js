import { RIDERS_SET } from '../actions'

const initialState = {
  riders: []
}

const riderReducer = (state = initialState, action) => {
  switch (action.type) {
    case RIDERS_SET:
      return {
        ...state,
        riders: action.payload
      }
    default:
      return state
  }
}

export default riderReducer
