const debug = require('debug')('state')
const path = require('path')
const { load, save } = require('./files')
const GAME_STATE = require('../../src/constants/game-state')

let state = load('state.json', {
  riders: [],
  leaderboard: {
    'female-power': [],
    'male-power': []
  },
  state: GAME_STATE.intro
})

module.exports = {
  get: () => state,

  set: (s) => {
    save(s, 'state.json')
    state = s
  },

  save: () => {
    save(state, 'state.json')
  },

  reset: () => {
    state.riders
      .forEach(rider => {
        delete rider.eliminated
        delete rider.selected
        delete rider.bike
        delete rider.winner
        delete rider.loser

        rider.races = 0
      })

    state.leaderboard = {
      'female-power': [],
      'male-power': []
    }

    save(state, 'state.json')
  }
}
