import { DEVICES_SET, DEVICES_ADD } from '../actions'

const initialState = {
  devices: []
}

const deviceReducer = (state = initialState, action) => {
  switch (action.type) {
    case DEVICES_SET:
      return {
        ...state,
        devices: action.payload
      };
    case DEVICES_ADD:
      console.info('devices', state.devices)
      console.info('payload', action.payload)

      const devices = state.devices
        .filter(device => device.id !== action.payload.id)
        .concat(action.payload)

      return {
        ...state,
        devices
      };
    default:
      return state
  }
}

export default deviceReducer
