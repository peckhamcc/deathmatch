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
  setLoadProgress,
  setLeaderboard
} from '../store/actions'
import GAME_STATE from '../constants/game-state'

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
}
