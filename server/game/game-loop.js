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

      if (emitter.state === GAME_STATE.race || emitter.state === GAME_STATE.sprinting || emitter.state === GAME_STATE.finishing) {
        const seconds = (now - then) / 1000
        const joules = player.power / seconds

        player.totalJoules += joules
        player.metersRemaining = trackLength - rangeMap(player.totalJoules, 0, player.targetJoules, 0, trackLength)

        if (emitter.state === GAME_STATE.finishing && player.totalJoules > player.targetJoules) {
          emitter.state = GAME_STATE.finished

          clearInterval(gameInterval)
          gameInterval = null

          emitter.emit('game:finished', player.id, players.filter(p => p.id !== player.id).pop().id)
        }
      }

      // within 5% of the end, show the finish line!
      if (emitter.state === GAME_STATE.race && player.totalJoules > (player.targetJoules - ((player.targetJoules / 100) * SPRINT_DISTANCE_FROM_FINISH))) {
        state.setGameState(GAME_STATE.sprinting)
      }

      // within 2% of the end, show the finish line!
      if (emitter.state === GAME_STATE.sprinting && player.totalJoules > (player.targetJoules - ((player.targetJoules / 100) * SHOW_FINISH_DISTANCE_FROM_FINISH))) {
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
