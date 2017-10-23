const GAME_STATE = require('../../src/constants/game-state')

const selectRiders = (emitter, riders) => {
  // remove eliminated riders
  let eligible = riders
    .filter(rider => !rider.eliminated)

  if (eligible.length > 2) {
    // if we are not at the final round, remove the rider who won the last round
    // no no-one does two races in a row
    eligible = eligible.filter(rider => !rider.winner)
  }

  // sort by number of races ascending so everyone rides at least once
  // before the first rider has to ride again
  eligible = eligible.sort((a, b) => {
      if (a.races < b.races) {
        return -1
      }

      if (a.races > b.races) {
        return 1
      }

      return 0
    })

  if (eligible.length > 1) {
    // there are two or more eligible riders, we race!
    emitter.state = GAME_STATE.riders

    // choose from the set of people who have ridden the fewest races

    if (eligible[0].races === eligible[1].races) {
      // e.g. 0, 0, 0, 1, 2 - just take the 0s
      eligible = eligible
        .filter(rider => rider.races === eligible[0].races)
        .sort(() => 0.5 - Math.random())
    } else {
      // e.g. 0, 1, 1, 1, 2 - take the 0 and a random 1
      eligible = [eligible[0]].concat(
        eligible
          .slice(1)
          .filter(rider => rider.races === eligible[1].races)
          .sort(() => 0.5 - Math.random())
          .pop()
      )
    }

    riders.forEach(rider => {
      delete rider.selected
      delete rider.bike
    })

    eligible
      .slice(0, 2)
      .forEach((rider, index) => {
        rider.selected = true
        rider.bike = index === 0 ? 'A' : 'B'
      })

    return true
  }

  eligible[0].winner = true

  return false
}

module.exports = selectRiders
