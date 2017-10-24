const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const socket = require('socket.io')
const http = require('http')
const debug = require('debug')('server')
const bluetooth = require('./devices')
const riders = require('./riders')
const game = require('./game')

const adminToken = 'something-random'

const app = express()
app.use('/deathmatch', serveStatic(path.resolve(path.join(__dirname, '..', 'dist'))))
app.use((req, res) => {
  res.redirect(301, '/deathmatch')
})

const server = http.createServer(app)
const io = socket(server)

io.on('connection', (client) => {
  debug('client', client.id, 'connected')

  client.on('admin:riders:create', (token, rider) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    io.emit('riders', riders.create(rider))
  })

  client.on('admin:riders:update', (token, rider) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    io.emit('riders', riders.update(rider))
  })

  client.on('admin:riders:delete', (token, rider) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    io.emit('riders', riders.delete(rider))
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

  client.on('admin:game:new', (token) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    riders.reset()
    game.selectRiders()
  })

  client.on('admin:game:continue', (token) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    game.selectRiders()
  })

  client.on('admin:game:rider-quit', (token, rider) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    game.riderHasQuit(rider)
  })

  client.on('admin:game:start', (token, trackLength) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    game.startGame(trackLength)
  })

  client.on('admin:game:stop', (token) => {
    if (token !== adminToken) {
      return debug('Invalid admin token')
    }

    game.cancelGame()

    io.emit('game:stop')
  })

  client.once('disconnect', () => {
    debug('client', client.id, 'disconnected')
  })

  client.emit('init', {
    bluetoothStatus: bluetooth.state,
    riders: riders.get(),
    devices: bluetooth.get(),
    state: game.state
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

game.on('game:countdown', () => {
  io.emit('game:countdown')
})

game.on('game:go', () => {
  io.emit('game:go')
})

game.on('game:sprint', () => {
  io.emit('game:sprint')
})

game.on('game:finishing', () => {
  io.emit('game:finishing')
})

game.on('game:riders', (riders) => {
  io.emit('game:riders', riders)
})

game.on('game:done', (riders) => {
  io.emit('game:done', riders)
})

game.on('game:finished', (winner, loser) => {
  riders.raceResult(winner, loser)

  io.emit('game:finished', riders.get())
})

game.on('game:players', (players) => {
  io.emit('game:players', players)
})

server.listen(5000, () => {
  debug('Listening on port 5000')
  debug(`window.adminToken = '${adminToken}'`)
})
