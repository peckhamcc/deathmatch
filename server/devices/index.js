const noble = require('noble')
const debug = require('debug')('devices')
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

const TYRE_CIRCUMFERENCES = {
  '20C': 2079.73,
  '23C': 2098.58,
  '25C': 2111.15
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

  if (device.status === DEVICE_STATUSES.unknown) {
    device.status = DEVICE_STATUSES.disconnected
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

        device.power = 0
      })

      cadence.subscribe((error) => {
        if (error) {
          debug(`Error subscribing to power characteristic of ${device.name}: ${error}`)
        }

        device.cadence = 0
      })

      let lastWheelEventTimeMs = -1
      let lastCrankEventTimeMs = -1
      let lastWheelRevolutions = -1
      let lastCrankRevolutions = -1

      power.on('data', (data) => {
        const measurement = powerMeasurement(data)

        debug(`Got power data from ${device.name}`, measurement)

        device.power = measurement.instantaneousPower
        emitter.emit('devices', peripherals)
      })

      cadence.on('data', (data) => {
        const measurement = cadenceMeasurement(data)

        debug(`Got cadence data from ${device.name}`, JSON.stringify(measurement, null, 2))

        if (lastWheelEventTimeMs !== -1 && lastCrankEventTimeMs !== -1) {
          // calculate cadence
          if (measurement.lastCrankEventTime) {
            const timeMs = measurement.lastCrankEventTime - lastCrankEventTimeMs
            const revolutions = measurement.cumulativeCrankRevolutions - lastCrankRevolutions

            if (revolutions === 0 || timeMs < 0) {
              device.rpm = 0
            } else {
              const revolutionsPerMs = revolutions / timeMs
              const revolutionsPerMinute = revolutionsPerMs * 60000

              device.cadence = parseInt(revolutionsPerMinute, 10)
            }
          }

          // calculate speed
          if (measurement.lastWheelEventTime) {
            const timeMs = measurement.lastWheelEventTime - lastWheelEventTimeMs
            const revolutions = measurement.cumulativeWheelRevolutions - lastWheelRevolutions

            if (revolutions === 0 || timeMs < 0) {
              device.speed = 0
            } else {
              const distanceTravelledMm = revolutions * TYRE_CIRCUMFERENCES['23C']
              const mmPerMs = distanceTravelledMm / timeMs
              const mmPerHour = mmPerMs * 3600000
              const kmPerHour = mmPerHour / 1000000

              device.speed = kmPerHour.toPrecision(2)
            }
          }

          debug(`Emitting ${device.name}`, JSON.stringify(device, null, 2))

          emitter.emit('devices', peripherals)
        }

        if (measurement.lastWheelEventTime) {
          lastWheelEventTimeMs = measurement.lastWheelEventTime
          lastWheelRevolutions = measurement.cumulativeWheelRevolutions
        }

        if (measurement.lastCrankEventTime) {
          lastCrankEventTimeMs = measurement.lastCrankEventTime
          lastCrankRevolutions = measurement.cumulativeCrankRevolutions
        }
      })
    })
  })
}

emitter.get = () => peripherals

emitter.assign = (deviceId, player) => {
  const device = peripherals.find(device => device.id === deviceId)

  if (!device) {
    return perifierals
  }

  device.player = player
  save(peripherals, 'devices.json')
  emitter.emit('devices', peripherals)
}

module.exports = emitter
