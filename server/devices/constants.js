
const SERVICE_TYPES = {
  POWER: '1818',
  SPEED_CADENCE: '1816',
  DEVICE_INFORMATION: '180a'
}

const CHARACTERISTIC_TYPES = {
  MANUFACTURER_NAME: '2a29',
  MODEL_NUMBER: '2a24',
  SERIAL_NUMBER: '2a25',
  HARDWARE_REVISION: '2a27',
  FIRMWARE_REVISION: '2a26',

  CYCLING_SPEED_CADENCE_MEASUREMENT: '2a5b',
  CYCLING_SPEED_CADENCE_FEATURE: '2a5c',
  SENSOR_LOCATION: '2a5d',
  CYCLING_POWER_MEASUREMENT: '2a63',
  CYCLING_POWER_FEATURE: '2a65',
  CYCLING_POWER_CONTROL_POINT: '2a66'
}

const TYRE_CIRCUMFERENCES = {
  '20C': 2079.73,
  '23C': 2098.58,
  '25C': 2111.15
}

module.exports = {
  SERVICE_TYPES,
  CHARACTERISTIC_TYPES,
  TYRE_CIRCUMFERENCES
}
