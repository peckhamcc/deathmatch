const EventEmitter = require('events').EventEmitter
const CHARACTERISTIC_TYPES = require('../../src/constants/characteristic-types')
const SERVICE_TYPES = require('../../src/constants/service-types')
const rangeMap = require('range-map')

const devices = new Array(4)
  .fill(0)
  .map((_, index) => {
    return {
      id: `fake-${index}`,
      advertisement: {
        rssi: 5,
        localName: `fake-${index}`,
        serviceUuids: [
          SERVICE_TYPES.POWER, SERVICE_TYPES.SPEED_CADENCE, SERVICE_TYPES.DEVICE_INFORMATION
        ]
      },
      connect: (cb) => {
        cb()
      },
      discoverSomeServicesAndCharacteristics: (services, characteristics, cb) => {
        const power = new EventEmitter()
        power.uuid = CHARACTERISTIC_TYPES.CYCLING_POWER_MEASUREMENT
        power.subscribe = cb => {
          cb()

          setInterval(() => {
            const data = Buffer.alloc(14)

            // write flags
            data.writeUInt8(3, 0)

            // write power measurement
            data.writeUInt16LE(rangeMap(Math.sin(Date.now() / 10000), -1, 1, 100, 1000), 2)

            power.emit('data', data)
          }, 1000)
        }

        const cadence = new EventEmitter()
        cadence.uuid = CHARACTERISTIC_TYPES.CYCLING_SPEED_CADENCE_MEASUREMENT
        cadence.subscribe = cb => {
          cb()

          setInterval(() => {
            const data = Buffer.alloc(11)

            // write flags saying wheel and crank revolution data is present
            data.writeUInt8(3, 0)

            // write wheel revolution measurement
            data.writeUInt32LE(0, 1)

            // write wheel revolution time measurement
            data.writeUInt16LE(0, 5)

            // write crank revolution measurement
            data.writeUInt16LE(0, 7)

            // write crank revolution time measurement
            data.writeUInt16LE(0, 9)

            cadence.emit('data', data)
          }, 1000)
        }

        cb(null, [], [
          power, cadence
        ])
      }
    }
  })

module.exports = (noble) => {
  devices.forEach(device => {
    noble.emit('discover', device)
  })
}