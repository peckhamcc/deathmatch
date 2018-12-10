import socket from './index'
import {
  updateBluetoothStatus,
  updateBluetoothSearchStatus,
  bluetoothSearchError,
  updateGameState,
  setRiders,
  setDevices,
  addDevice,
  setPlayers,
  setDemo,
  setLeaderboard,
  setFreeplay,
  setNumPlayers,
  setTrackLength
} from '../store/actions'

export default (store) => {
  socket.on('bluetooth:status', ({status}) => {
    store.dispatch(updateBluetoothStatus(status))
  })

  socket.on('device:search:start', () => {
    store.dispatch(updateBluetoothSearchStatus(true))
  })

  socket.on('device:search:stop', () => {
    store.dispatch(updateBluetoothSearchStatus(false))
  })

  socket.on('device:search:error', (error) => {
    store.dispatch(bluetoothSearchError(error))

    alert(error.message)
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

  socket.on('players', (players) => {
    store.dispatch(setPlayers(players))
  })

  socket.on('game:state', (state) => {
    store.dispatch(updateGameState(state))
  })

  socket.on('demo', () => {
    store.dispatch(setDemo(true))
  })

  socket.on('leaderboard', (leaderboard) => {
    store.dispatch(setLeaderboard(leaderboard))
  })

  socket.on('game:freeplay', (freeplay) => {
    store.dispatch(setFreeplay(freeplay))
  })

  socket.on('game:numPlayers', (numPlayers) => {
    store.dispatch(setNumPlayers(numPlayers))
  })

  socket.on('game:trackLength', (trackLength) => {
    store.dispatch(setTrackLength(trackLength))
  })
}
