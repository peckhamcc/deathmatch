import shortid from 'shortid'

const createRiders = () => ([{
  'id': shortid.generate(),
  'name': 'Alex Denise',
  'age': '35',
  'gender': 'male',
  'weight': '68',
  'photoSelect': './photos/alexd-select.png',
  'photoWin': './photos/alexd-happy.png',
  'photoLose': './photos/alexd-sad.png',
  'photoPower': './photos/alexd-power.png',
  'races': 0
}, {
  'id': shortid.generate(),
  'name': 'Alex Potsides',
  'age': '37',
  'gender': 'female',
  'weight': '74',
  'photoSelect': './photos/alexp-select.png',
  'photoWin': './photos/alexp-happy.png',
  'photoLose': './photos/alexp-sad.png',
  'photoPower': './photos/alexp-power.png',
  'races': 0
}, {
  'id': shortid.generate(),
  'name': 'Chris Durham',
  'age': '32',
  'gender': 'male',
  'weight': '74',
  'photoSelect': './photos/chris-select.png',
  'photoWin': './photos/chris-happy.png',
  'photoLose': './photos/chris-sad.png',
  'photoPower': './photos/chris-power.png',
  'races': 0
}, {
  'id': shortid.generate(),
  'name': 'Geoff Davies',
  'age': '32',
  'gender': 'female',
  'weight': '74',
  'photoSelect': './photos/geoff-select.png',
  'photoWin': './photos/geoff-happy.png',
  'photoLose': './photos/geoff-sad.png',
  'photoPower': './photos/geoff-power.png',
  'races': 0
}, {
  'id': shortid.generate(),
  'name': 'James Mcfarlane',
  'age': '32',
  'gender': 'male',
  'weight': '74',
  'photoSelect': './photos/james-select.png',
  'photoWin': './photos/james-happy.png',
  'photoLose': './photos/james-sad.png',
  'photoPower': './photos/james-power.png',
  'races': 0
}, {
  'id': shortid.generate(),
  'name': 'Tim Clark',
  'age': '30',
  'gender': 'female',
  'weight': '70',
  'photoSelect': './photos/oldtim-select.png',
  'photoWin': './photos/oldtim-happy.png',
  'photoLose': './photos/oldtim-sad.png',
  'photoPower': './photos/oldtim-power.png',
  'races': 0
}, {
  'id': shortid.generate(),
  'name': 'Paul Schneider',
  'age': '30',
  'gender': 'male',
  'weight': '70',
  'photoSelect': './photos/paul-select.png',
  'photoWin': './photos/paul-happy.png',
  'photoLose': './photos/paul-sad.png',
  'photoPower': './photos/paul-power.png',
  'races': 0
}, {
  'id': shortid.generate(),
  'name': 'Rob Whitworth',
  'age': '30',
  'gender': 'female',
  'weight': '70',
  'photoSelect': './photos/rob-select.png',
  'photoWin': './photos/rob-happy.png',
  'photoLose': './photos/rob-sad.png',
  'photoPower': './photos/rob-power.png',
  'races': 0
}, {
  'id': shortid.generate(),
  'name': 'Tim El-Oun',
  'age': '36',
  'gender': 'male',
  'weight': '72',
  'photoSelect': './photos/tim-select.png',
  'photoWin': './photos/tim-happy.png',
  'photoLose': './photos/tim-sad.png',
  'photoPower': './photos/tim-power.png',
  'races': 0
}, {
  'id': shortid.generate(),
  'name': 'Tom Meakin',
  'age': '30',
  'gender': 'female',
  'weight': '72',
  'photoSelect': './photos/tom-select.png',
  'photoWin': './photos/tom-happy.png',
  'photoLose': './photos/tom-sad.png',
  'photoPower': './photos/tom-power.png',
  'races': 0
}
])

let riders = createRiders()

module.exports = {
  get: () => riders,

  set: (r) => {
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

    return riders
  },

  delete: (rider) => {
    riders = riders
      .filter(r => rider.id !== r.id)

    return riders
  },

  reset: () => {
    riders
      .forEach(rider => {
        delete rider.eliminated
        delete rider.eliminatedAt
        delete rider.selected
        delete rider.bike
        delete rider.winner
        delete rider.loser

        rider.races = 0
      })

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

    return riders
  }
}
