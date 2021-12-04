import { EventEmitter } from 'events'
import game from './game.js'
import riders from './riders.js'

export default () => {
  const socket = new EventEmitter()

  socket.on('admin:game:new', (token) => {
    riders.reset()
    game.selectRiders()
  })

  socket.on('admin:game:continue', (token) => {
    game.selectRiders()
  })

  socket.on('admin:game:rider-quit', (token, rider) => {
    game.riderHasQuit(rider)
  })

  socket.on('admin:game:start', (token, trackLength) => {
    game.startGame(trackLength, riders)
  })

  socket.on('admin:game:stop', (token) => {
    game.cancelGame()
  })

  game.on('game:countdown', () => {
    socket.emit('game:countdown')
  })

  game.on('game:go', () => {
    socket.emit('game:go')
  })

  game.on('game:sprint', () => {
    socket.emit('game:sprint')
  })

  game.on('game:finishing', () => {
    socket.emit('game:finishing')
  })

  game.on('game:riders', (riders) => {
    socket.emit('game:riders', riders)
  })

  game.on('game:done', (riders) => {
    socket.emit('game:done', riders)
  })

  game.on('game:finished', (winner, loser) => {
    riders.raceResult(winner, loser)

    socket.emit('game:finished', riders.get())
  })

  game.on('game:players', (players) => {
    socket.emit('game:players', players)
  })

  setTimeout(() => {
    console.warn('*** DEMO MODE ***')

    socket.emit('demo')
    socket.emit('init', {
      bluetoothStatus: 'poweredOn',
      riders: riders.get(),
      devices: [],
      state: game.state
    })
  })

  return socket
}
