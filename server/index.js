const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const socket = require('socket.io')
const http = require('http')
const debug = require('debug')('server')
const bluetooth = require('./devices')
const game = require('./game')
const photos = require('./photos')
const GAME_STATE = require('../src/constants/game-state')

const adminToken = 'something-random'
const PORT = 5000

const app = express()
app.use('/deathmatch', serveStatic(path.resolve(path.join(__dirname, '..', 'dist'))))
app.use('/deathmatch/photos', serveStatic(path.resolve(path.join(__dirname, '..', 'photos'))))
app.use((req, res) => {
  res.redirect(301, '/deathmatch')
})

const server = http.createServer(app)
const io = socket(server)
const state = require('./state')(io)

io.on('connection', (client) => {
  debug('client', client.id, 'connected')

  client.on('admin:riders:create', (token, rider) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    state.createRider(rider)
  })

  client.on('admin:riders:update', (token, rider) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    state.updateRider(rider)
  })

  client.on('admin:riders:delete', (token, rider) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    state.deleteRider(rider)
  })

  client.on('admin:photo:upload', (token, id, photo) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    client.emit(`admin:photo:uploaded:${id}`, photos.upload(photo))
  })

  client.on('admin:devices:search:start', (token) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    bluetooth.startSearching()
  })

  client.on('admin:devices:search:stop', (token) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    bluetooth.stopSearching()
  })

  client.on('admin:devices:connect', (token, id) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    bluetooth.connect(id)
  })

  client.on('admin:devices:assign', (token, deviceId, player) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    bluetooth.assign(deviceId, player)
  })

  client.on('admin:game:intro', (token) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    state.reset()
  })

  client.on('admin:game:new', (token) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    state.reset()
    game.selectRiders(state)
  })

  client.on('admin:game:continue', (token) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    game.selectRiders(state)
  })

  client.on('admin:game:rider-quit', (token, rider) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    state.eliminateRider(rider)
    game.selectRiders(state)
  })

  client.on('admin:game:start', (token, trackLength) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    game.startGame(trackLength, state)
  })

  client.on('admin:game:stop', (token) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    game.cancelGame()
  })

  client.once('disconnect', () => {
    debug('client', client.id, 'disconnected')
  })

  client.emit('init', {
    state: state.get()
  })
})

bluetooth.on('stateChange', (state) => {
  io.emit('bluetooth:status', { status: state })
})

bluetooth.on('search:start', (state) => {
  io.emit('device:search:start')
})

bluetooth.on('search:stop', (state) => {
  io.emit('device:search:stop')
})

bluetooth.on('devices', (devices) => {
  io.emit('devices', devices)
})

game.on('game:players', (players) => {
  io.emit('players', players)
})

server.listen(PORT, () => {
  debug(`Listening on port ${PORT}`)
  debug(`window.adminToken = '${adminToken}'`)
})
