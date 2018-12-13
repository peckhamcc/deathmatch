const EventEmitter = require('events').EventEmitter
const devices = require('../devices')
const selectRiders = require('./select-riders')
const { startGame, stopGame } = require('./game-loop')
const GAME_STATE = require('../../src/constants/game-state')
const lights = require('../lights')

const emitter = new EventEmitter()

emitter.startGame = (trackLength, state) => {
  const getWatts = (player) => {
    const device = devices.get()
      .find(device => device.player === player.bike && device.power !== undefined)

    if (!device) {
      return -1
    }

    return device.power
  }
  const getCadence = (player) => {
    const device = devices.get()
      .find(device => device.player === player.bike && device.cadence !== undefined)

    if (!device) {
      return -1
    }

    return device.cadence
  }

  const getSpeed = (player) => {
    const device = devices.get()
      .find(device => device.player === player.bike && device.speed !== undefined)

    if (!device) {
      return -1
    }

    return device.speed
  }

  startGame(emitter, getWatts, getCadence, getSpeed, trackLength, state)

  state.setGameState(GAME_STATE.countingDown)

  lights.dome.rotate(0)

  let on = false
  const interval = setInterval(() => {
    on = !on

    if (on) {
      lights.dome.colour(255, 255, 255)
    } else {
      lights.dome.colour(0, 0, 0)
    }
  }, 500)

  setTimeout(() => {
    clearInterval(interval)
    state.setGameState(GAME_STATE.race)

    lights.dome.rotate(100)
  }, 6000)
}

emitter.selectRiders = (state, otherRider) => {
  const riders = state.get().riders.riders
  const willRace = selectRiders(emitter, riders, otherRider)

  state.setRiders(riders)

  if (!willRace) {
    // we have a champion
    state.setGameState(GAME_STATE.done)
  } else {
    state.setGameState(GAME_STATE.riders)
  }
}

emitter.eliminateRider = (state, rider) => {
  const riders = state.get().riders.riders

  riders
    .filter(r => r.id === rider.id)
    .forEach(r => {
      r.eliminated = true
    })

  state.setRiders(riders)

  const otherRider = riders
    .filter(r => r.id !== rider.id)
    .filter(r => r.bike)
    .pop()

  emitter.selectRiders(state, otherRider)
}

emitter.startFreeplay = (state, players, trackLength) => {
  const r = state.get().riders.riders
    .map(rider => {
      delete rider.selected
      delete rider.bike

      if (players.indexOf(rider.id) === 0) {
        rider.selected = true
        rider.bike = 'A'
      }

      if (players.indexOf(rider.id) === 1) {
        rider.selected = true
        rider.bike = 'B'
      }

      if (players.indexOf(rider.id) === 2) {
        rider.selected = true
        rider.bike = 'C'
      }

      if (players.indexOf(rider.id) === 3) {
        rider.selected = true
        rider.bike = 'D'
      }

      return rider
    })

  state.setRiders(r)

  emitter.startGame(trackLength, state)
}

emitter.cancelGame = () => {
  stopGame()
}

module.exports = emitter
