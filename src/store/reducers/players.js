import { PLAYERS_SET } from '../actions'
import rangeMap from 'range-map'
import { PLAYER_SPRITE_WIDTH } from '../../components/player'
import { STAGE_WIDTH } from '../../constants/settings'
import PLAYER_STATUS from '../../constants/player-status'

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

      player1.x = rangeMap(p2Diff, -(MAX_DIFF), MAX_DIFF, 0, STAGE_WIDTH - PLAYER_SPRITE_WIDTH - 50)
      player2.x = rangeMap(p1Diff, -(MAX_DIFF), MAX_DIFF, 0, STAGE_WIDTH - PLAYER_SPRITE_WIDTH - 50)

      action.payload.forEach(player => {
        player.status = PLAYER_STATUS.NORMAL

        if (player.power > 400) {
          player.status = PLAYER_STATUS.FAST
        }

        if (player.power > 600) {
          player.status = PLAYER_STATUS.FASTER
        }

        if (player.power > 800) {
          player.status = PLAYER_STATUS.FASTEST
        }
      })

      return {
        ...state,
        players: action.payload
      }
    default:
      return state
  }
}

export default playerReducer
