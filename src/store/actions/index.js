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
export const LOADED_SET = 'LOADED/SET'

const setAction = (type) => (payload) => ({
  type,
  payload
})

export const setAdminToken = setAction(ADMIN_TOKEN)
export const setDemo = setAction(DEMO_SET)
export const updateBluetoothStatus = setAction(BLUETOOTH_STATUS)
export const updateBluetoothSearchStatus = setAction(BLUETOOTH_SEARCH_STATUS)
export const updateGameState = setAction(GAME_MODE)
export const setDevices = setAction(DEVICES_SET)
export const setLoaded = setAction(LOADED_SET)
export const addDevice = setAction(DEVICES_ADD)
export const setPlayers = setAction(PLAYERS_SET)
export const setRiders = setAction(RIDERS_SET)
export const selectRiders = setAction(RIDERS_SELECT)
export const setTrackLength = setAction(TRACK_LENGTH_SET)
export const setLoadProgress = setAction(LOADED_SET)
