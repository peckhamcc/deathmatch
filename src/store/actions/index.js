export const ADMIN_TOKEN = 'ADMIN_TOKEN'
export const BLUETOOTH_STATUS = 'BLUETOOTH_STATUS'
export const BLUETOOTH_SEARCH_STATUS = 'BLUETOOTH_SEARCH_STATUS'
export const GAME_MODE = 'GAME_MODE'
export const DEVICES_SET = 'DEVICES/SET'
export const DEVICES_ADD = 'DEVICES/ADD'
export const PLAYERS_SET = 'PLAYERS/SET'
export const RIDERS_SET = 'RIDERS/SET'
export const RIDERS_SELECT = 'RIDERS/SELECT'
export const TRACK_LENGTH_SET = 'TRACK_LENGTH/SET'
export const DEMO_SET = 'DEMO/SET'

export const setAdminToken = token => ({
  type: ADMIN_TOKEN,
  payload: token
})

export const setDemo = () => ({
  type: DEMO_SET,
  payload: true
})

export const updateBluetoothStatus = status => ({
  type: BLUETOOTH_STATUS,
  payload: status
})

export const updateBluetoothSearchStatus = status => ({
  type: BLUETOOTH_SEARCH_STATUS,
  payload: status
})

export const updateGameState = state => {
  return {
    type: GAME_MODE,
    payload: state
  }
}

export const setDevices = devices => ({
  type: DEVICES_SET,
  payload: devices
})

export const addDevice = device => ({
  type: DEVICES_ADD,
  payload: device
})

export const setPlayers = players => ({
  type: PLAYERS_SET,
  payload: players
})

export const setRiders = riders => ({
  type: RIDERS_SET,
  payload: riders
})

export const selectRiders = riders => ({
  type: RIDERS_SELECT,
  payload: riders
})

export const setTrackLength = trackLength => ({
  type: TRACK_LENGTH_SET,
  payload: trackLength
})
