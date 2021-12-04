import noble from '@abandonware/noble'
import debug from 'debug'
import { EventEmitter } from 'events'
import { load, save } from '../files.js'
import powerMeasurement from './power-measurement.js'
import cadenceMeasurement from './cadence-measurement.js'
import DEVICE_STATUSES from '../../src/constants/devices.js'
import SERVICE_TYPES from '../../src/constants/service-types.js'
import CHARACTERISTIC_TYPES from '../../src/constants/characteristic-types.js'
import TYRE_CIRCUMFERENCES from '../../src/constants/tyre-circumferences.js'
import fakeDevices from './fake-devices.js'

const log = debug('deathmatch:devices')
const emitter = new EventEmitter()
const peripherals = load('devices.json')

peripherals.forEach(device => {
  device.status = DEVICE_STATUSES.unknown
})

emitter.state = noble.state

noble.on('stateChange', (state) => {
  emitter.state = state
  emitter.emit('stateChange', state)
})

noble.on('discover', (peripheral) => {
  log('discovered', peripheral)

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
  noble.startScanning([SERVICE_TYPES.POWER, SERVICE_TYPES.SPEED_CADENCE], true, (err) => {
    if (err) {
      emitter.emit('search:error', err)
      emitter.emit('search:stop')

      return
    }

    fakeDevices(noble)

    searchStopTimeout = setTimeout(() => {
      emitter.stopSearching()
    }, 10000)
  })
}

emitter.stopSearching = () => {
  noble.stopScanning()
  emitter.emit('search:stop')
  clearTimeout(searchStopTimeout)
}

emitter.connect = (id) => {
  log(`Connecting to ${id}`)
  const device = peripherals
    .find(device => device.id === id)

  if (!device) {
    log('Cannot connect to non-existent device', id)
    return
  }

  log('Found device', device)

  device.status = DEVICE_STATUSES.connecting
  emitter.emit('devices', peripherals)

  device.peripheral.connect((error) => {
    if (error) {
      return log(`Error connecting to ${device.name}: ${error}`)
    }

    device.status = DEVICE_STATUSES.connected
    emitter.emit('devices', peripherals)

    log(`connected to ${device.name}`)

    device.peripheral.discoverSomeServicesAndCharacteristics([
      SERVICE_TYPES.POWER,
      SERVICE_TYPES.SPEED_CADENCE
    ], [
      CHARACTERISTIC_TYPES.CYCLING_POWER_MEASUREMENT,
      CHARACTERISTIC_TYPES.CYCLING_SPEED_CADENCE_MEASUREMENT
    ], (error, services, characteristics) => {
      if (error) {
        return log(`Error discovering services and charateristics of ${device.name}: ${error}`)
      }

      const power = characteristics.find(c => c.uuid === CHARACTERISTIC_TYPES.CYCLING_POWER_MEASUREMENT)
      const cadence = characteristics.find(c => c.uuid === CHARACTERISTIC_TYPES.CYCLING_SPEED_CADENCE_MEASUREMENT)

      if (!power) {
        return log(`Could not find power measurement characteristic ${device.name}`)
      }

      if (!cadence) {
        return log(`Could not find cadence measurement characteristic of ${device.name}`)
      }

      power.subscribe((error) => {
        if (error) {
          log(`Error subscribing to power characteristic of ${device.name}: ${error}`)
        }

        device.power = 0
      })

      cadence.subscribe((error) => {
        if (error) {
          log(`Error subscribing to power characteristic of ${device.name}: ${error}`)
        }

        device.cadence = 0
      })

      power.on('data', (data) => {
        const measurement = powerMeasurement(data)

        log(`Got power data from ${device.name}`, measurement)

        device.power = measurement.instantaneousPower
        emitter.emit('devices', peripherals)
      })

      let lastCadenceTime = -1
      let lastWheelRevolutions = -1
      let lastCrankRevolutions = -1

      cadence.on('data', (data) => {
        const measurement = cadenceMeasurement(data)

        log(`Got cadence data from ${device.name}`, JSON.stringify(measurement, null, 2))

        if (lastCadenceTime !== -1) {
          const timeMs = Date.now() - lastCadenceTime

          if (measurement.cumulativeCrankRevolutions) {
            if (lastCrankRevolutions < measurement.cumulativeCrankRevolutions) {
              // calculate cadence
              const revolutions = measurement.cumulativeCrankRevolutions - lastCrankRevolutions

              if (revolutions === 0 || timeMs < 0) {
                device.rpm = 0
              } else {
                const revolutionsPerMs = revolutions / timeMs
                const revolutionsPerMinute = revolutionsPerMs * 60000

                device.cadence = parseInt(revolutionsPerMinute, 10)
              }
            }

            lastCrankRevolutions = measurement.cumulativeCrankRevolutions
          }

          // calculate speed
          if (measurement.cumulativeWheelRevolutions) {
            if (lastWheelRevolutions < measurement.cumulativeWheelRevolutions) {
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

            lastWheelRevolutions = measurement.cumulativeWheelRevolutions
          }

          emitter.emit('devices', peripherals)
        }

        lastCadenceTime = Date.now()
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

  peripherals.forEach(device => {
    if (device.player === player) {
      delete device.player
    }
  })

  device.player = player
  save(peripherals, 'devices.json')
  emitter.emit('devices', peripherals)
}

export default emitter
