const debug = require('debug')('state')
const path = require('path')
const { load, save } = require('./files')
const bluetooth = require('./devices')
const GAME_STATE = require('../src/constants/game-state')
const shortid = require('shortid')
const { writeFileSync } = require('fs')

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
    demo: false
  },
  leaderboard: {
    power: {
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

let s = load('state.json', defaultState())
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
        delete rider.selected
        delete rider.bike
        delete rider.winner
        delete rider.loser

        rider.races = 0
      })

    s.leaderboard = {
      power: {
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

  setRiders: (riders) => {
    s.riders.riders = riders

    socket.emit('riders', s.riders.riders)
  },

  eliminateRider: (rider) => {
    s.riders.riders
      .filter(r => rider.id === r.id)
      .forEach(r => {
        r.eliminated = true
      })

    state.save()

    socket.emit('riders', state.riders.riders)
  },
/*
  addRiderPhoto: (rider, type, photo) => {
    rider = s.riders.riders
      .find(r => r.id === rider.id)

    if (!rider) {
      return riders
    }

    writeFileSync(path.join(path.resolve(path.join(__dirname, '..', 'photos')), `${rider.id}-${type}.png`), photo.replace(/^data:image\/\w+;base64,/, ''), {
      encoding: 'base64'
    })

    rider[`photo${type.substring(0, 1).toUpperCase()}${type.substring(1)}`] = `/photos/${rider.id}-${type}.png`

    state.save()

    socket.emit('riders', state.riders.riders)
  },
*/

/*
  selectPlayers: () => {
    s.riders.riders.forEach(rider => {
      delete rider.winner
      delete rider.loser
      delete rider.selected
      delete rider.bike
    })

    const player1 = findRider(riders)
    const player2 = findRider(riders, player1.id)

    player1.selected = true
    player1.bike = 'A'
    player2.selected = true
    player2.bike = 'B'

    state.save()

    return s.riders.riders
  },
*/
  setPlayers: (players) => {
    s.players.players = players

    socket.emit('players', s.players.players)
  },

  raceResult: (winner, loser) => {
    s.riders.riders
      .forEach(rider => {
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
      })

    state.save()

    return s.riders.riders
  },

  setGameState: (state) => {
    s.game.state = state

    state.save()

    io.emit('game:state', s.game.state)
  }
}

module.exports = (s) => {
  socket = s

  return state
}
