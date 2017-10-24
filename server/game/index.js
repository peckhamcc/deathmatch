const EventEmitter = require('events').EventEmitter
const rangeMap = require('range-map')
const riders = require('../riders')
const selectRiders = require('./select-riders')
const { startGame, stopGame } = require('./game-loop')
const GAME_STATE = require('../../src/constants/game-state')

const emitter = new EventEmitter()

emitter.state = GAME_STATE.intro

emitter.startGame = (trackLength) => {
  const getWatts = () => parseInt(200 + (Math.random() * 100), 10)
  const getCadence = () => parseInt(20 + (Math.random() * 100), 10)

  startGame(emitter, getWatts, getCadence, trackLength, riders)

  setTimeout(() => {
    emitter.state = GAME_STATE.countingDown
    emitter.emit('game:countdown')
  }, 1000)

  setTimeout(() => {
    emitter.state = GAME_STATE.race
    emitter.emit('game:go')
  }, 7000)
}

emitter.riderHasQuit = (rider) => {
  const r = riders
    .get()
    .map(r => {
      if (r.id === rider.id) {
        r.eliminated = true
      }

      return r
    })

  riders.set(r)
  emitter.selectRiders(emitter, r)
}

emitter.selectRiders = () => {
  const r = riders.get()
  const willRace = selectRiders(emitter, r)

  riders.set(r)

  if (willRace) {
    emitter.emit('game:riders', r)
  } else {
    // we have a champion
    emitter.state = GAME_STATE.done
    emitter.emit('game:done', r)
  }
}

emitter.cancelGame = () => {
  stopGame()
}

module.exports = emitter
