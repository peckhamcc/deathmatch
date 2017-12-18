const rangeMap = require('range-map')
const setUpPlayers = require('./setup-players')
const GAME_STATE = require('../../src/constants/game-state')
const POWER = require('../../src/constants/power')
const light = require('../light')

const SPRINT_DISTANCE_FROM_FINISH = 30
const SHOW_FINISH_DISTANCE_FROM_FINISH = 2
const MAX_LEADERBOARD_SIZE = 10

let gameInterval

const updateLeaderboard = (leaderboard, value, player) => {
  leaderboard.push({
    player,
    value
  })

  let playerEntries = 0

  leaderboard = leaderboard
    .sort((a, b) => b.value - a.value)
    .filter(entry => {
      if (entry.player === player) {
        playerEntries++

        return playerEntries === 1
      }

      return true
    })

  if (leaderboard.length > MAX_LEADERBOARD_SIZE) {
    leaderboard.length = MAX_LEADERBOARD_SIZE
  }

  return leaderboard
}

const gameLoop = (emitter, getWatts, getCadence, getSpeed, trackLength, then, players, state) => {
  return () => {
    let now = Date.now()
    const leaderboard = state.getLeaderboard()

    players = players.map(player => {
      player.power = getWatts(player)
      player.cadence = getCadence(player)
      player.metersRemaining = trackLength
      player.speed = getSpeed(player)

      if (state.get().game.state === GAME_STATE.race || state.get().game.state === GAME_STATE.sprint || state.get().game.state === GAME_STATE.finishing) {
        const seconds = (now - then) / 1000
        const joules = player.power / seconds

        player.totalJoules += joules
        player.metersRemaining = trackLength - rangeMap(player.totalJoules, 0, player.targetJoules, 0, trackLength)

        leaderboard.power[player.gender] = updateLeaderboard(leaderboard.power[player.gender], player.power, player.id)
        leaderboard.cadence[player.gender] = updateLeaderboard(leaderboard.cadence[player.gender], player.cadence, player.id)
        leaderboard.speed[player.gender] = updateLeaderboard(leaderboard.speed[player.gender], player.speed, player.id)
        leaderboard.joules[player.gender] = updateLeaderboard(leaderboard.joules[player.gender], player.totalJoules, player.id)

        if (state.get().game.state === GAME_STATE.finishing && player.totalJoules > player.targetJoules) {
          clearInterval(gameInterval)
          gameInterval = null

          const winner = player.id
          const loser = players.filter(p => p.id !== player.id).pop().id
          const riders = state.get().riders.riders
            .map(rider => {
              delete rider.winner
              delete rider.loser
      
              if (rider.id === loser) {
                rider.eliminated = true
                rider.eliminatedAt = Date.now()
                rider.loser = true
                rider.races = rider.races + 1
              }
      
              if (rider.id === winner) {
                rider.winner = true
                rider.races = rider.races + 1
              }

              return rider
            })

          state.setRiders(riders)
          state.setGameState(GAME_STATE.finished)

          light.colour((player.bike === 'A' ? 255 : 0), 0, (player.bike === 'B' ? 255 : 0))
          light.motor(0)
        }
      }

      // within 5% of the end, show the finish line!
      if (state.get().game.state === GAME_STATE.race && player.totalJoules > (player.targetJoules - ((player.targetJoules / 100) * SPRINT_DISTANCE_FROM_FINISH))) {
        state.setGameState(GAME_STATE.sprint)

        light.flash(100)
      }

      // within 2% of the end, show the finish line!
      if (state.get().game.state === GAME_STATE.sprint && player.totalJoules > (player.targetJoules - ((player.targetJoules / 100) * SHOW_FINISH_DISTANCE_FROM_FINISH))) {
        state.setGameState(GAME_STATE.finishing)

        light.flash(10)
      }

      return player
    })

    then = now

    state.setLeaderboard(leaderboard)
    state.setPlayers(players)

    if (state.get().game.state === GAME_STATE.race) {
      const remaining = players[0].metersRemaining < players[1].metersRemaining ? players[0].metersRemaining : players[1].metersRemaining
      light.motor(rangeMap(remaining, 0, trackLength - ((trackLength / 100) * SPRINT_DISTANCE_FROM_FINISH), 255, 200))
    }
  }
}

module.exports = {
  startGame: (emitter, getWatts, getCadence, getSpeed, trackLength, state) => {
    if (gameInterval) {
      module.exports.stopGame()
    }

    const players = setUpPlayers(
      state.get().riders.riders
        .filter(rider => rider.selected)
        .sort((a, b) => a.bike.localeCompare(b.bike)),
        trackLength
    )

    state.setPlayers(players)

    gameInterval = setInterval(gameLoop(emitter, getWatts, getCadence, getSpeed, trackLength, Date.now(), players, state), 1000)
  },

  stopGame: () => {
    clearInterval(gameInterval)
    gameInterval = null
  }
}
