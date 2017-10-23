const noble = require('noble')
const debug = require('debug')('bluetooth')
const EventEmitter = require('events').EventEmitter

const emitter = new EventEmitter()
const periferals = {}

const TYPES = {
  POWER: '1818',
  SPEED_CADENCE: '1816',
  DEVICE_INFORMATION: '180a'
}

emitter.state = noble.state

noble.on('stateChange', (state) => {
  emitter.state = state
  emitter.emit('stateChange', state)
})

noble.on('discover', (peripheral) => {
  const services = peripheral.advertisement.serviceUuids

  debug(`discovered ${peripheral}`)

  periferals[peripheral.id] = periferals[peripheral.id] || {
    id: peripheral.id,
    name: peripheral.id,
    services: [],
    signal: peripheral.advertisement.txPowerLevel
  }

  if (peripheral.advertisement) {
    const advert = peripheral.advertisement

    if (advert.localName) {
      periferals[peripheral.id].name = advert.localName
    }

    if (advert.serviceUuids) {
      periferals[peripheral.id].services = advert.serviceUuids
    }

    if (advert.txPowerLevel) {
      periferals[peripheral.id].signal = advert.txPowerLevel
    }
  }

  periferals[peripheral.id].device = peripheral

  emitter.emit('device', periferals[peripheral.id])
})

let searchStopTimeout

emitter.startSearch = () => {
  emitter.emit('search:start')
  noble.startScanning()

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
  const peripheral = periferals[id]

  peripheral.device.connect((error) => {
    if (error) {
      return debug(`Error connecting to ${peripheral.name}: ${error}`)
    }

    debug(`connected to ${peripheral.name}`)

    peripheral.device.discoverAllServicesAndCharacteristics((error, services, characteristics) => {
      if (error) {
        return debug(`Error discovering services and charateristics of ${peripheral.name}: ${error}`)
      }

      debug(peripheral.name, 'services', services)
      debug(peripheral.name, 'characteristics', characteristics)
    })
  })
}

module.exports = emitter
