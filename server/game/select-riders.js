import PLAYER_COLOURS from '../../src/constants/player-colours.js'
import PLAYER_LETTERS from '../../src/constants/player-letters.js'

const selectRiders = (emitter, state, riders, otherRider) => {
  const numPlayers = state.getNumPlayers()

  // remove eliminated riders
  let eligible = riders
    .filter(rider => !rider.eliminated)

  if (eligible.length > numPlayers) {
    // if we are not at the final round, remove the rider who won the last round
    // so no-one does two races in a row
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

    // A rider dropped out, make sure the remaining rider is still in the race
    if (otherRider) {
      if (otherRider.bike === 'A') {
        if (eligible[1].id === otherRider.id) {
          eligible[1] = eligible[0]
        }

        eligible[0] = otherRider
      } else if (otherRider.bike === 'B') {
        if (eligible[0].id === otherRider.id) {
          eligible[0] = eligible[1]
        }

        eligible[1] = otherRider
      }
    }

    riders.forEach(rider => {
      delete rider.selected
      delete rider.bike
      delete rider.colour
    })

    eligible
      .slice(0, numPlayers)
      .sort((a, b) => {
        // tallest player on bike A, shortest on bike B
        if (a.height < b.height) {
          return 1
        }

        if (a.height > b.height) {
          return -1
        }

        return 0
      })
      .forEach((rider, index) => {
        rider.selected = true
        rider.bike = PLAYER_LETTERS[index]
        rider.colour = PLAYER_COLOURS[index]
      })

    return true
  }

  eligible[0].winner = true

  return false
}

export default selectRiders
