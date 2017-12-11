const rangeMap = require('range-map')
const setUpPlayers = require('./setup-players')
const GAME_STATE = require('../../src/constants/game-state')
const POWER = require('../../src/constants/power')

const SPRINT_DISTANCE_FROM_FINISH = 30
const SHOW_FINISH_DISTANCE_FROM_FINISH = 2

let gameInterval

const gameLoop = (emitter, getWatts, getCadence, trackLength, then, players, state) => {
  return () => {
    let now = Date.now()

    players = players.map(player => {
      player.power = getWatts(player)
      player.cadence = getCadence(player)
      player.metersRemaining = trackLength

      if (state.get().game.state === GAME_STATE.race || state.get().game.state === GAME_STATE.sprint || state.get().game.state === GAME_STATE.finishing) {
        const seconds = (now - then) / 1000
        const joules = player.power / seconds

        player.totalJoules += joules
        player.metersRemaining = trackLength - rangeMap(player.totalJoules, 0, player.targetJoules, 0, trackLength)

        if (state.get().game.state === GAME_STATE.finishing && player.totalJoules > player.targetJoules) {
          clearInterval(gameInterval)
          gameInterval = null

          const winner = player.id
          const loser = players.filter(p => p.id !== player.id).pop().id
          const riders = state.get().riders.riders
            .map(rider => {
              delete rider.winner
              delete rider.loser
      
              if (rider.id === loser) {
                rider.eliminated = true
                rider.loser = true
                rider.races = rider.races + 1
              }
      
              if (rider.id === winner) {
                rider.winner = true
                rider.races = rider.races + 1
              }

              return rider
            })

          state.setRiders(riders)
          state.setGameState(GAME_STATE.finished)
        }
      }

      // within 5% of the end, show the finish line!
      if (state.get().game.state === GAME_STATE.race && player.totalJoules > (player.targetJoules - ((player.targetJoules / 100) * SPRINT_DISTANCE_FROM_FINISH))) {
        state.setGameState(GAME_STATE.sprint)
      }

      console.info('game state', state.get().game.state, GAME_STATE.sprint, 'is GAME_STATE.sprint', state.get().game.state === GAME_STATE.sprint)

      // within 2% of the end, show the finish line!
      if (state.get().game.state === GAME_STATE.sprint && player.totalJoules > (player.targetJoules - ((player.targetJoules / 100) * SHOW_FINISH_DISTANCE_FROM_FINISH))) {
        state.setGameState(GAME_STATE.finishing)
      }

      return player
    })

    then = now

    state.setPlayers(players)
  }
}

module.exports = {
  startGame: (emitter, getWatts, getCadence, trackLength, state) => {
    if (gameInterval) {
      module.exports.stopGame()
    }

    const players = setUpPlayers(
      state.get().riders.riders
        .filter(rider => rider.selected)
        .sort((a, b) => a.bike.localeCompare(b.bike)),
        trackLength
    )

    state.setPlayers(players)

    gameInterval = setInterval(gameLoop(emitter, getWatts, getCadence, trackLength, Date.now(), players, state), 1000)
  },

  stopGame: () => {
    clearInterval(gameInterval)
    gameInterval = null
  }
}
