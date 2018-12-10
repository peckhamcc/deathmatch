import {
  GAME_MODE,
  TRACK_LENGTH_SET,
  DEMO_SET,
  LOADED_SET,
  FREEPLAY_SET,
  NUM_PLAYERS_SET
} from '../actions'
import GAME_STATE from '../../constants/game-state'

const initialState = {
  loaded: 0,
  state: GAME_STATE.connecting,
  trackLength: 250,
  demo: false,
  freeplay: false,
  numPlayers: 2
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
    case LOADED_SET:
      return {
        ...state,
        loaded: action.payload
      }
    case FREEPLAY_SET:
      return {
        ...state,
        freeplay: action.payload
      }
    case NUM_PLAYERS_SET:
      return {
        ...state,
        numPlayers: action.payload
      }
    default:
      return state
  }
}

export default updateGameState
