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
  setDemo,
  setLoadProgress
} from '../store/actions'
import GAME_STATE from '../constants/game-state'
import assets from '../css/assets'

export default (store) => {
  socket.on('init', ({ bluetoothStatus, riders, devices, state }) => {
    store.dispatch(updateBluetoothStatus(bluetoothStatus))
    store.dispatch(setRiders(riders))
    store.dispatch(setDevices(devices))
    store.dispatch(updateGameState(GAME_STATE.loading))

    assets.load(riders, (done, total) => {
      store.dispatch(setLoadProgress(100 - parseInt((done / total) * 100, 10)))
    }, () => {
      store.dispatch(updateGameState(state))
    })
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

  socket.on('devices', (devices) => {
    store.dispatch(setDevices(devices))
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
    store.dispatch(setDemo(true))
  })
}
