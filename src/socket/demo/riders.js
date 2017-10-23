import shortid from 'shortid'

const createRiders = () => ([{
  "id": shortid.generate(),
  "name":"Alex Potsides",
  "age":"37",
  "gender":"male",
  "weight":"74",
  "image":0,
  "races":0
}, {
  "id":shortid.generate(),
  "name": "Katherine Potsides",
  "age":"35",
  "gender":"female",
  "weight":"68",
  "image":0,
  "races":0
}, {
  "id": shortid.generate(),
  "name":"Rob Whitworth",
  "age":"30",
  "gender":"male",
  "weight":"70",
  "image":1,
  "races":0
}, {
  "id": shortid.generate(),
  "name":"Tegwen Tucker",
  "age":"36",
  "gender":"female",
  "weight":"72",
  "image":1,
  "races":0
}, {
  "id": shortid.generate(),
  "name":"Jon Arm",
  "age":"39",
  "gender":"male",
  "weight":"75",
  "image":2,
  "races":0
}, {
  "id": shortid.generate(),
  "name":"Hannah Sender",
  "age":"32",
  "gender":"female",
  "weight":"62",
  "image":2,
  "races":0
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
