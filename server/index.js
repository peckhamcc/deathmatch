import express from 'express'
import serveStatic from 'serve-static'
import path from 'path'
import { Server } from 'socket.io'
import http from 'http'
import debug from 'debug'
import bluetooth from './devices/index.js'
import game from './game/index.js'
import * as photos from './photos.js'
import GAME_STATE from '../src/constants/game-state.js'
import * as lights from './lights.js'
import createState from './state.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const log = debug('deathmatch:server')
const adminToken = 'something-random'
const PORT = 5000

process.on('unhandledRejection', error => {
  console.error(error.stack)

  throw error
})

const app = express()
app.use('/deathmatch', serveStatic(path.resolve(path.join(__dirname, '..', 'dist'))))
app.use('/deathmatch/photos', serveStatic(path.resolve(path.join(__dirname, '..', 'photos'))))
app.use('/', (req, res) => {
  res.redirect(301, '/deathmatch')
})

const server = http.createServer(app)

const io = new Server(server)
const state = createState(io)

io.on('connection', (client) => {
  log('client', client.id, 'connected')

  client.on('admin:riders:create', (token, rider) => {
    if (token !== adminToken) {
      return log('Invalid admin token')
    }

    state.createRider(rider)
  })

  client.on('admin:riders:update', (token, rider) => {
    if (token !== adminToken) {
      return log('Invalid admin token')
    }

    state.updateRider(rider)
  })

  client.on('admin:riders:delete', (token, rider) => {
    if (token !== adminToken) {
      return log('Invalid admin token')
    }

    state.deleteRider(rider)
  })

  client.on('admin:photo:upload', (token, id, photo) => {
    if (token !== adminToken) {
      return log('Invalid admin token')
    }

    client.emit(`admin:photo:uploaded:${id}`, photos.upload(photo))
  })

  client.on('admin:devices:search:start', (token) => {
    if (token !== adminToken) {
      return log('Invalid admin token')
    }

    bluetooth.startSearching()
  })

  client.on('admin:devices:search:stop', (token) => {
    if (token !== adminToken) {
      return log('Invalid admin token')
    }

    bluetooth.stopSearching()
  })

  client.on('admin:devices:connect', (token, id) => {
    if (token !== adminToken) {
      return log('Invalid admin token')
    }

    bluetooth.connect(id)
  })

  client.on('admin:devices:assign', (token, deviceId, player) => {
    if (token !== adminToken) {
      return log('Invalid admin token')
    }

    bluetooth.assign(deviceId, player)
  })

  client.on('admin:game:intro', (token) => {
    if (token !== adminToken) {
      return log('Invalid admin token')
    }

    state.reset()
    state.setFreeplay(false)
    lights.dome.colour(255, 255, 0)
    lights.dome.rotate(100)

    lights.spider1.motorSpeed(100)
    lights.spider1.animate(100)
    lights.spider2.motorSpeed(100)
    lights.spider2.animate(100)

    lights.laser.colour(255, 255, 255, 255)
    lights.laser.animate(150)
  })

  client.on('admin:game:freeplay', (token) => {
    if (token !== adminToken) {
      return log('Invalid admin token')
    }

    state.reset()
    state.setFreeplay(true)
    state.setGameState(GAME_STATE.riders)
  })

  client.on('admin:game:freeplay:start', (token, trackLength, players) => {
    if (token !== adminToken) {
      return log('Invalid admin token')
    }

    game.startFreeplay(state, players, trackLength)
  })

  client.on('admin:game:new', (token) => {
    if (token !== adminToken) {
      return log('Invalid admin token')
    }

    state.reset()
    state.setFreeplay(false)
    game.selectRiders(state)

    lights.dome.colour(255, 255, 255)
    lights.dome.rotate(100)

    lights.spider1.motorSpeed(100)
    lights.spider1.animate(100)
    lights.spider2.motorSpeed(100)
    lights.spider2.animate(100)

    lights.laser.colour(255, 255, 255, 255)
    lights.laser.animate(150)
  })

  client.on('admin:game:continue', (token) => {
    if (token !== adminToken) {
      return log('Invalid admin token')
    }

    game.selectRiders(state)

    lights.dome.colour(255, 255, 255)
    lights.dome.rotate(100)

    lights.spider1.motorSpeed(100)
    lights.spider1.animate(100)
    lights.spider2.motorSpeed(100)
    lights.spider2.animate(100)

    lights.laser.colour(255, 255, 255, 255)
    lights.laser.animate(150)
  })

  client.on('admin:game:rider-quit', (token, rider) => {
    if (token !== adminToken) {
      return log('Invalid admin token')
    }

    game.riderQuit(state, rider)
  })

  client.on('admin:game:start', (token, trackLength) => {
    if (token !== adminToken) {
      return log('Invalid admin token')
    }

    game.startGame(trackLength, state)
  })

  client.on('admin:game:stop', (token) => {
    if (token !== adminToken) {
      return log('Invalid admin token')
    }

    game.cancelGame()
  })

  client.on('admin:game:results', (token) => {
    if (token !== adminToken) {
      return log('Invalid admin token')
    }

    state.setGameState(GAME_STATE.results)
  })

  client.on('admin:game:set-num-players', (token, numPlayers) => {
    if (token !== adminToken) {
      return log('Invalid admin token')
    }

    state.setNumPlayers(numPlayers)
  })

  client.on('admin:game:set-track-length', (token, trackLength) => {
    if (token !== adminToken) {
      return log('Invalid admin token')
    }

    state.setTrackLength(trackLength)
  })

  client.once('disconnect', () => {
    log('client', client.id, 'disconnected')
  })

  client.emit('init', {
    state: state.get()
  })
})

bluetooth.on('stateChange', (state) => {
  io.emit('bluetooth:status', { status: state })
})

bluetooth.on('search:start', () => {
  io.emit('device:search:start')
})

bluetooth.on('search:stop', () => {
  io.emit('device:search:stop')
})

bluetooth.on('search:error', (error) => {
  io.emit('device:search:error', {
    message: error.message
  })
})

bluetooth.on('devices', (devices) => {
  io.emit('devices', devices)
})

game.on('game:players', (players) => {
  io.emit('players', players)
})

server.listen(PORT, () => {
  log(`Listening on port ${PORT}`)
  log(`window.adminToken = '${adminToken}'`)
})
