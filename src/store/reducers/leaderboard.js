import { LEADERBOARD_SET } from '../actions'

const initialState = {
  power: {
    female: [],
    male: []
  },
  cadence: {
    female: [],
    male: []
  },
  joules: {
    female: [],
    male: []
  },
  speed: {
    female: [],
    male: []
  }
}

const leaderboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case LEADERBOARD_SET:
      return action.payload
    default:
      return state
  }
}

export default leaderboardReducer
