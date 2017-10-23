import { BLUETOOTH_STATUS, BLUETOOTH_SEARCH_STATUS } from '../actions'
import BLUETOOTH_STATUSES from '../../constants/bluetooth'

const initialState = {
  status: 'poweredOff',
  searching: false
}

const bluetoothReducer = (state = initialState, action) => {
  switch (action.type) {
    case BLUETOOTH_STATUS:
      let status = action.payload

      if (!BLUETOOTH_STATUSES[status]) {
        console.warn(`Unknown Bluetooth status ${action.payload}`)
        status = 'unknown'
      }

      return {
        ...state,
        status
      }
    case BLUETOOTH_SEARCH_STATUS:
      return {
        ...state,
        searching: action.payload
      }
    default:
      return state
  }
}

export default bluetoothReducer
