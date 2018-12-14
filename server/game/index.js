const EventEmitter = require('events').EventEmitter
const devices = require('../devices')
const selectRiders = require('./select-riders')
const { startGame, stopGame } = require('./game-loop')
const GAME_STATE = require('../../src/constants/game-state')
const lights = require('../lights')
const PLAYER_LETTERS = require('../../src/constants/player-letters')
const PLAYER_COLOURS = require('../../src/constants/player-colours')

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
  lights.spider1.colour(0, 0, 0, 0)
  lights.spider2.colour(0, 0, 0, 0)
  lights.spider1.motorPositon(100)
  lights.spider2.motorPositon(100)
  lights.spider1.motorSpeed(0)
  lights.spider2.motorSpeed(0)
  lights.laser.colour(0, 0, 0, 0)

  let on = false
  const interval = setInterval(() => {
    on = !on

    if (on) {
      lights.dome.colour(255, 255, 255)
      lights.spider1.colour(255, 255, 255, 255)
      lights.spider2.colour(255, 255, 255, 255)
      lights.laser.colour(255, 255, 255, 255)
    } else {
      lights.dome.colour(0, 0, 0)
      lights.spider1.colour(0, 0, 0, 0)
      lights.spider2.colour(0, 0, 0, 0)
      lights.laser.colour(0, 0, 0, 0)
    }
  }, 500)

  setTimeout(() => {
    clearInterval(interval)
    state.setGameState(GAME_STATE.race)

    lights.dome.rotate(100)

    lights.spider1.motorSpeed(100)
    lights.spider2.motorSpeed(100)

    lights.spider1.animate(100)
    lights.spider2.animate(100)

    lights.laser.colour(255, 255, 255, 255)
    lights.laser.animate()
  }, 6000)
}

emitter.selectRiders = (state, otherRider) => {
  const riders = state.get().riders.riders
  const willRace = selectRiders(emitter, state, riders, otherRider)

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
      delete rider.colour

      const index = players.indexOf(rider.id)

      if (PLAYER_LETTERS[index]) {
        rider.selected = true
        rider.bike = PLAYER_LETTERS[index]
        rider.colour = PLAYER_COLOURS[index]
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
