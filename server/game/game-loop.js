import rangeMap from 'range-map'
import setUpPlayers from './setup-players.js'
import GAME_STATE from '../../src/constants/game-state.js'
import PLAYER_POWER from '../../src/constants/power.js'
import * as lights from '../lights.js'

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

let maxPowerTimeout

const gameLoop = (emitter, getWatts, getCadence, getSpeed, trackLength, then, players, state) => {
  const maxPowerHit = () => {
    if (maxPowerTimeout) {
      clearTimeout(maxPowerTimeout)
    }

    lights.dome.strobe(200)
    lights.spider1.strobe(200)
    lights.spider2.strobe(200)

    maxPowerTimeout = setTimeout(() => {
      const gameState = state.get().game.state

      if (
        gameState === GAME_STATE.race ||
        gameState === GAME_STATE.sprint ||
        gameState === GAME_STATE.finishing
      ) {
        lights.dome.strobe(0)
        lights.dome.rotate(100)
        lights.dome.colour(255, 255, 255)
        lights.spider1.strobe(0)
        lights.spider2.strobe(0)
      }
    }, 1000)
  }

  return () => {
    const now = Date.now()
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

        if (player.power > PLAYER_POWER.MAX) {
          maxPowerHit()
        }

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

          lights.dome.colour(player.colour.r, player.colour.g, player.colour.b, player.colour.w)
          lights.dome.rotate(0)

          lights.spider1.strobe(0)
          lights.spider2.strobe(0)

          lights.spider1.motorSpeed(0)
          lights.spider2.motorSpeed(0)

          lights.spider1.motorPositon(100)
          lights.spider2.motorPositon(100)

          lights.spider1.colour(player.colour.r, player.colour.g, player.colour.b, player.colour.w)
          lights.spider2.colour(player.colour.r, player.colour.g, player.colour.b, player.colour.w)

          lights.laser.colour(player.colour.r, player.colour.g, player.colour.b, player.colour.w)
          lights.laser.animate(0)
        }
      }

      // within 5% of the end
      if (state.get().game.state === GAME_STATE.race && player.totalJoules > (player.targetJoules - ((player.targetJoules / 100) * SPRINT_DISTANCE_FROM_FINISH))) {
        state.setGameState(GAME_STATE.sprint)

        lights.dome.rotate(255)

        lights.spider1.strobe(100)
        lights.spider2.strobe(100)
      }

      // within 2% of the end, go nuts
      if (state.get().game.state === GAME_STATE.sprint && player.totalJoules > (player.targetJoules - ((player.targetJoules / 100) * SHOW_FINISH_DISTANCE_FROM_FINISH))) {
        state.setGameState(GAME_STATE.finishing)

        lights.spider1.strobe(255)
        lights.spider2.strobe(255)

        lights.spider1.motorSpeed(255)
        lights.spider2.motorSpeed(255)
      }

      return player
    })

    then = now

    state.setLeaderboard(leaderboard)
    state.setPlayers(players)
  }
}

export function startGame (emitter, getWatts, getCadence, getSpeed, trackLength, state) {
  if (gameInterval) {
    stopGame()
  }

  const players = setUpPlayers(
    state.get().riders.riders
      .filter(rider => rider.selected)
      .sort((a, b) => a.bike.localeCompare(b.bike)),
    trackLength
  )

  state.setPlayers(players)

  gameInterval = setInterval(gameLoop(emitter, getWatts, getCadence, getSpeed, trackLength, Date.now(), players, state), 1000)
}

export function stopGame () {
  clearInterval(gameInterval)
  gameInterval = null
}
