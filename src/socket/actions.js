import socket from './index'
import {
  updateBluetoothStatus,
  updateBluetoothSearchStatus,
  updateGameState,
  setRiders,
  selectRiders,
  setDevices,
  addDevice,
  setPlayers,
  setDemo
} from '../store/actions'
import GAME_STATE from '../constants/game-state'

export default (store) => {
  socket.on('init', ({ bluetoothStatus, riders, devices, state }) => {
    store.dispatch(updateBluetoothStatus(bluetoothStatus))
    store.dispatch(setRiders(riders))
    store.dispatch(setDevices(devices))
    store.dispatch(updateGameState(state))
  })

  socket.on('bluetooth:status', ({status}) => {
    store.dispatch(updateBluetoothStatus(status))
  })

  socket.on('device:search:start', () => {
    store.dispatch(updateBluetoothSearchStatus(true))
  })

  socket.on('device:search:stop', () => {
    store.dispatch(updateBluetoothSearchStatus(false))
  })

  socket.on('device:found', (device) => {
    store.dispatch(addDevice(device))
  })

  socket.on('riders', (riders) => {
    store.dispatch(setRiders(riders))
  })

  socket.on('game:riders', (riders) => {
    store.dispatch(setRiders(riders))
    store.dispatch(updateGameState(GAME_STATE.riders))
  })

  socket.on('game:done', (riders) => {
    store.dispatch(setRiders(riders))
    store.dispatch(updateGameState(GAME_STATE.done))
  })

  socket.on('game:players', (players) => {
    store.dispatch(setPlayers(players))
  })

  socket.on('game:countdown', () => {
    store.dispatch(updateGameState(GAME_STATE.countingDown))
  })

  socket.on('game:go', () => {
    store.dispatch(updateGameState(GAME_STATE.race))
  })

  socket.on('game:sprint', () => {
    
  })

  socket.on('game:finishing', () => {
    store.dispatch(updateGameState(GAME_STATE.finishing))
  })

  socket.on('game:finished', (riders) => {
    store.dispatch(setRiders(riders))
    store.dispatch(updateGameState(GAME_STATE.finished))
  })

  socket.on('demo', () => {
    store.dispatch(setDemo())
  })
}
