import debug from 'debug'
import { load, save } from './files.js'
import bluetooth from './devices/index.js'
import GAME_STATE from '../src/constants/game-state.js'
import shortid from 'shortid'

const log = debug('deathmatch:state')

const defaultState = () => ({
  admin: {
    token: 'something-random'
  },
  bluetooth: {
    status: 'poweredOff',
    searching: false
  },
  devices: {
    devices: []
  },
  game: {
    state: GAME_STATE.intro,
    trackLength: 250,
    demo: false,
    freeplay: false,
    numPlayers: 2
  },
  leaderboard: {
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
  },
  players: {
    players: []
  },
  riders: {
    riders: []
  }
})

const s = load('state.json', defaultState())
s.game.state = GAME_STATE.intro

let socket = null

const state = {
  get: () => {
    s.bluetooth.status = bluetooth.state

    return s
  },

  save: () => {
    save(s, 'state.json')
  },

  reset: (nextGameState) => {
    s.riders.riders
      .forEach(rider => {
        delete rider.eliminated
        delete rider.eliminatedAt
        delete rider.selected
        delete rider.bike
        delete rider.winner
        delete rider.loser
        delete rider.colour

        rider.races = 0
      })

    s.leaderboard = {
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

    s.game.state = nextGameState || GAME_STATE.intro

    state.save()

    socket.emit('game:state', s.game.state)
  },

  createRider: (rider) => {
    s.riders.riders.push({
      id: shortid.generate(),
      name: rider.name,
      age: rider.age,
      gender: rider.gender,
      weight: rider.weight,
      height: rider.height,
      races: 0,
      photoSelect: rider.photoSelect,
      photoWin: rider.photoWin,
      photoLose: rider.photoLose,
      photoPower: rider.photoPower
    })

    state.save()

    socket.emit('riders', s.riders.riders)
  },

  updateRider: (rider) => {
    s.riders.riders
      .filter(r => rider.id === r.id)
      .forEach(r => {
        r.name = rider.name
        r.age = rider.age
        r.gender = rider.gender
        r.weight = rider.weight
        r.height = rider.height
        r.photoSelect = rider.photoSelect
        r.photoWin = rider.photoWin
        r.photoLose = rider.photoLose
        r.photoPower = rider.photoPower
      })

    state.save()

    socket.emit('riders', s.riders.riders)
  },

  deleteRider: (rider) => {
    s.riders.riders = s.riders.riders
      .filter(r => rider.id !== r.id)

    state.save()

    socket.emit('riders', s.riders.riders)
  },

  eliminateRider: (rider) => {
    s.riders.riders
      .filter(r => rider.id !== r.id)
      .forEach(r => {
        r.eliminated = true
        r.eliminatedAt = Date.now()
      })

    state.save()

    socket.emit('riders', s.riders.riders)
  },

  setRiders: (riders) => {
    s.riders.riders = riders

    socket.emit('riders', s.riders.riders)
  },

  setPlayers: (players) => {
    s.players.players = players

    socket.emit('players', s.players.players)
  },

  getNumPlayers: () => {
    return s.game.numPlayers
  },

  setGameState: (gameState) => {
    s.game.state = gameState

    state.save()

    socket.emit('game:state', s.game.state)
  },

  setFreeplay: (freeplay) => {
    s.game.freeplay = freeplay

    state.save()

    socket.emit('game:freeplay', freeplay)
  },

  getLeaderboard: () => {
    return s.leaderboard
  },

  setLeaderboard: (leaderboard) => {
    s.leaderboard = leaderboard

    state.save()

    socket.emit('leaderboard', leaderboard)
  },

  setNumPlayers: (numPlayers) => {
    s.game.numPlayers = numPlayers

    state.save()

    socket.emit('game:numPlayers', s.game.numPlayers)
  },

  setTrackLength: (trackLength) => {
    s.game.trackLength = trackLength

    state.save()

    socket.emit('game:trackLength', s.game.trackLength)
  }
}

export default (s) => {
  socket = s

  return state
}
