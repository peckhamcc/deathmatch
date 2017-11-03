const rangeMap = require('range-map')
const setUpPlayers = require('./setup-players')
const GAME_STATE = require('../../src/constants/game-state')

const SPRINT_DISTANCE_FROM_FINISH = 10
const SHOW_FINISH_DISTANCE_FROM_FINISH = 2
const POWER_STATES = {
  normal: 'NORMAL',
  fast: 'FAST',
  max: 'MAX'
}

let gameInterval

const gameLoop = (emitter, getWatts, getCadence, trackLength, then, players) => {
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
        emitter.state = GAME_STATE.sprinting
        emitter.emit('game:sprint')
      }

      // within 2% of the end, show the finish line!
      if (emitter.state === GAME_STATE.sprinting && player.totalJoules > (player.targetJoules - ((player.targetJoules / 100) * SHOW_FINISH_DISTANCE_FROM_FINISH))) {
        emitter.state = GAME_STATE.finishing
        emitter.emit('game:finishing')
      }

      player.powerState = POWER_STATES.normal

      if (player.power > 400) {
        player.powerState.fast
      }

      if (player.power > 800) {
        player.powerState.max
      }

      return player
    })

    then = now

    emitter.emit('game:players', players)
  }
}

module.exports = {
  startGame: (emitter, getWatts, getCadence, trackLength, riders) => {
    if (gameInterval) {
      module.exports.stopGame()
    }

    gameInterval = setInterval(gameLoop(emitter, getWatts, getCadence, trackLength, Date.now(), setUpPlayers(
      riders.get()
        .filter(rider => rider.selected)
        .sort((a, b) => a.bike.localeCompare(b.bike)),
      trackLength
    )), 1000)
  },

  stopGame: () => {
    clearInterval(gameInterval)
    gameInterval = null
  }
}
