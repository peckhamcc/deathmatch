import { EventEmitter } from 'events'
import riders from './riders.js'
import selectRiders from '../../../server/game/select-riders.js'
import { startGame, stopGame } from '../../../server/game/game-loop.js'
import GAME_STATE from '../../constants/game-state.js'

const emitter = new EventEmitter()

emitter.state = GAME_STATE.intro

emitter.startGame = (trackLength) => {
  const getWatts = () => parseInt(150 + (Math.random() * 400), 10)
  const getCadence = () => parseInt(50 + (Math.random() * 100), 10)

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
  const willRace = selectRiders(emitter, {
    getNumPlayers: () => 2
  }.r)

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

export default emitter
