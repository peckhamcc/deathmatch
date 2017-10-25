import { GAME_MODE, TRACK_LENGTH_SET, DEMO_SET } from '../actions'
import GAME_STATE from '../../constants/game-state'

const initialState = {
  state: GAME_STATE.connecting,
  trackLength: 400,
  demo: false
}

const updateGameState = (state = initialState, action) => {
  switch (action.type) {
    case GAME_MODE:
      console.info(`GAME_MODE = ${action.payload}`)

      return {
        ...state,
        state: action.payload
      }
    case TRACK_LENGTH_SET:
      return {
        ...state,
        trackLength: action.payload
      }
    case DEMO_SET:
      return {
        ...state,
        demo: action.payload
      }
    default:
      return state
  }
}

export default updateGameState
