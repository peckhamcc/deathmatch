const noble = require('noble')
const debug = require('debug')('bluetooth')
const EventEmitter = require('events').EventEmitter
const { load, save } = require('../files')
const powerMeasurement = require('./power-measurement')
const cadenceMeasurement = require('./cadence-measurement')
const DEVICE_STATUSES = require('../../src/constants/devices')

const emitter = new EventEmitter()
const peripherals = load('devices.json')

peripherals.forEach(device => {
  device.status = DEVICE_STATUSES.unknown
})

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

emitter.state = noble.state

noble.on('stateChange', (state) => {
  emitter.state = state
  emitter.emit('stateChange', state)
})

noble.on('discover', (peripheral) => {
  const services = peripheral.advertisement.serviceUuids

  debug(`discovered ${peripheral}`)

  let device = peripherals
    .find(device => device.id === peripheral.id)

  if (!device) {
    device = {
      id: peripheral.id,
      name: peripheral.id,
      services: [],
      signal: peripheral.advertisement.rssi,
      status: DEVICE_STATUSES.disconnected
    }

    peripherals.push(device)
  }

  if (peripheral.advertisement) {
    const advert = peripheral.advertisement

    if (advert.localName) {
      device.name = advert.localName
    }

    if (advert.serviceUuids && advert.serviceUuids.length) {
      device.services = advert.serviceUuids
    }
  }

  Object.defineProperty(device, 'peripheral', {
    configurable: true,
    writable: true,
    value: peripheral
  })

  save(peripherals, 'devices.json')
  emitter.emit('devices', peripherals)
})

let searchStopTimeout

emitter.startSearching = () => {
  emitter.emit('search:start')
  noble.startScanning([SERVICE_TYPES.POWER, SERVICE_TYPES.SPEED_CADENCE], true)

  searchStopTimeout = setTimeout(() => {
    emitter.stopSearching()
  }, 10000)
}

emitter.stopSearching = () => {
  noble.stopScanning()
  emitter.emit('search:stop')
  clearTimeout(searchStopTimeout)
}

emitter.connect = (id) => {
  const device = peripherals
    .find(device => device.id === id)

  if (!device) {
    debug('Cannot connect to non-existent device', id)
    return
  }

  device.status = DEVICE_STATUSES.connecting
  emitter.emit('devices', peripherals)

  device.peripheral.connect((error) => {
    if (error) {
      return debug(`Error connecting to ${device.name}: ${error}`)
    }

    device.status = DEVICE_STATUSES.connected
    emitter.emit('devices', peripherals)

    debug(`connected to ${device.name}`)

    device.peripheral.discoverSomeServicesAndCharacteristics([
      SERVICE_TYPES.POWER,
      SERVICE_TYPES.SPEED_CADENCE
    ], [
      CHARACTERISTIC_TYPES.CYCLING_POWER_MEASUREMENT,
      CHARACTERISTIC_TYPES.CYCLING_SPEED_CADENCE_MEASUREMENT
    ], (error, services, characteristics) => {
      if (error) {
        return debug(`Error discovering services and charateristics of ${device.name}: ${error}`)
      }

      const power = characteristics.find(c => c.uuid === CHARACTERISTIC_TYPES.CYCLING_POWER_MEASUREMENT)
      const cadence = characteristics.find(c => c.uuid === CHARACTERISTIC_TYPES.CYCLING_SPEED_CADENCE_MEASUREMENT)

      if (!power) {
        return debug(`Could not find power measurement characteristic ${device.name}`)
      }

      if (!cadence) {
        return debug(`Could not find cadence measurement characteristic of ${device.name}`)
      }

      power.subscribe((error) => {
        if (error) {
          debug(`Error subscribing to power characteristic of ${device.name}: ${error}`)
        }
      })

      cadence.subscribe((error) => {
        if (error) {
          debug(`Error subscribing to power characteristic of ${device.name}: ${error}`)
        }
      })

      power.on('data', (data) => {
        const measurement = powerMeasurement(data)

        debug(`Got power data from ${device.name}`, measurement)

        device.power = measurement.instantaneousPower
        emitter.emit('devices', peripherals)
      })

      cadence.on('data', (data) => {
        const measurement = cadenceMeasurement(data)

        debug(`Got cadence data from ${device.name}`, measurement)

        device.cadence = measurement.cumulativeWheelRevolutions
        emitter.emit('devices', peripherals)
      })
    })
  })
}

emitter.get = () => peripherals

module.exports = emitter
