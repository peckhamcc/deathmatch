const debug = require('debug')('riders')
const shortid = require('shortid')
const { load, save } = require('./files')

let riders = load('riders.json')

const images = {
  male: {
    max: 2,
    last: 2
  },
  female: {
    max: 2,
    last: 2
  }
}

module.exports = {
  get: () => riders,

  set: (r) => {
    save(r, 'riders.json')
    riders = r
  },

  create: (rider) => {
    const next = riders.filter(r => r.gender === rider.gender).pop() || { image: 0 }

    if (next.image === images[rider.gender].max) {
      images[rider.gender].last = 0
    }

    riders.push({
      id: shortid.generate(),
      name: rider.name,
      age: rider.age,
      gender: rider.gender,
      weight: rider.weight,
      image: images[rider.gender].last,
      races: 0
    })

    images[rider.gender].last++

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
