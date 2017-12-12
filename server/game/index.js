const EventEmitter = require('events').EventEmitter
const rangeMap = require('range-map')
const devices = require('../devices')
const selectRiders = require('./select-riders')
const { startGame, stopGame } = require('./game-loop')
const GAME_STATE = require('../../src/constants/game-state')

const emitter = new EventEmitter()

emitter.startGame = (trackLength, state) => {
  const getWatts = (player) => {
    const device = devices.get()
      .find(device => (device.player || '') === player.bike && device.power !== undefined)

    if (!device) {
      return parseInt(150 + (Math.random() * 400), 10)
    }

    return device.power
  }
  const getCadence = (player) => {
    const device = devices.get()
      .find(device => (device.player || '').toLowerCase() === player.bike && device.cadence !== undefined)

    if (!device) {
      return parseInt(20 + (Math.random() * 100), 10)
    }

    return device.cadence
  }

  const getSpeed = (player) => {
    const device = devices.get()
      .find(device => (device.player || '').toLowerCase() === player.bike && device.speed !== undefined)

    if (!device) {
      return parseInt(20 + (Math.random() * 10), 10)
    }

    return device.speed
  }

  startGame(emitter, getWatts, getCadence, getSpeed, trackLength, state)

  setTimeout(() => {
    state.setGameState(GAME_STATE.countingDown)
  }, 1000)

  setTimeout(() => {
    state.setGameState(GAME_STATE.race)
  }, 7000)
}

emitter.selectRiders = (state) => {
  const r = state.get().riders.riders
  const willRace = selectRiders(emitter, r)

  state.setRiders(r)

  if (!willRace) {
    // we have a champion
    state.setGameState(GAME_STATE.done)
  } else {
    state.setGameState(GAME_STATE.riders)
  }
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

      return rider
    })

  state.setRiders(r)

  emitter.startGame(trackLength, state)
}

emitter.cancelGame = () => {
  stopGame()
}

module.exports = emitter
