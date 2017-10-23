import { PLAYERS_SET } from '../actions'
import rangeMap from 'range-map'
import { SPRITE_WIDTH } from '../../components/player'
import { STAGE_WIDTH } from '../../constants/settings'

const initialState = {
  players: []
}

const MAX_DIFF = 50

const playerReducer = (state = initialState, action) => {
  switch (action.type) {
    case PLAYERS_SET:
      const player1 = action.payload[0]
      const player2 = action.payload[1]
      let p1Diff = player1.metersRemaining - player2.metersRemaining
      let p2Diff = player2.metersRemaining - player1.metersRemaining

      if (p1Diff > MAX_DIFF) {
        p1Diff = MAX_DIFF
      }

      if (p1Diff < -(MAX_DIFF)) {
        p1Diff = -(MAX_DIFF)
      }

      if (p2Diff > MAX_DIFF) {
        p2Diff = MAX_DIFF
      }

      if (p2Diff < -(MAX_DIFF)) {
        p2Diff = -MAX_DIFF
      }

      player1.x = rangeMap(p2Diff, -(MAX_DIFF), MAX_DIFF, 0, STAGE_WIDTH - SPRITE_WIDTH - 50)
      player2.x = rangeMap(p1Diff, -(MAX_DIFF), MAX_DIFF, 0, STAGE_WIDTH - SPRITE_WIDTH - 50)

      return {
        ...state,
        players: action.payload
      };
    default:
      return state
  }
}

export default playerReducer
