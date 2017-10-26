const debug = require('debug')('riders')
const shortid = require('shortid')
const { load, save } = require('./files')
const { writeFileSync } = require('fs')
const path = require('path')

let riders = load('riders.json')

module.exports = {
  get: () => riders,

  set: (r) => {
    save(r, 'riders.json')
    riders = r
  },

  create: (rider) => {
    riders.push({
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

    save(riders, 'riders.json')

    return riders
  },

  update: (rider) => {
    riders
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

    save(riders, 'riders.json')

    return riders
  },

  delete: (rider) => {
    riders = riders
      .filter(r => rider.id !== r.id)

    save(riders, 'riders.json')

    return riders
  },

  addPhoto: (rider, type, photo) => {
    rider = riders
      .find(r => r.id === rider.id)

    if (!rider) {
      return riders
    }

    writeFileSync(path.join(path.resolve(path.join(__dirname, '..', 'photos')), `${rider.id}-${type}.png`), photo.replace(/^data:image\/\w+;base64,/, ''), {
      encoding: 'base64'
    })

    rider[`photo${type.substring(0, 1).toUpperCase()}${type.substring(1)}`] = `/photos/${rider.id}-${type}.png`

    save(riders, 'riders.json')

    return riders
  },

  reset: () => {
    riders
      .forEach(rider => {
        delete rider.eliminated
        delete rider.selected
        delete rider.bike
        delete rider.winner
        delete rider.loser

        rider.races = 0
      })

    save(riders, 'riders.json')

    return riders
  },

  selectPlayers: () => {
    riders.forEach(rider => {
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

    save(riders, 'riders.json')

    return riders
  },

  raceResult: (winner, loser) => {
    riders
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

    save(riders, 'riders.json')

    return riders
  }
}
