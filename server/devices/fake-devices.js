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

            // write power measurement 100-1000w
            data.writeUInt16LE(rangeMap(Math.sin(Date.now() / 10000), -1, 1, 100, 1000), 2)

            power.emit('data', data)
          }, 1000)
        }

        let lastCrankRevolutions = 0
        let lastWheelRevolutions = 0
        let lastTime = Date.now()

        const cadence = new EventEmitter()
        cadence.uuid = CHARACTERISTIC_TYPES.CYCLING_SPEED_CADENCE_MEASUREMENT
        cadence.subscribe = cb => {
          cb()

          setInterval(() => {
            let timeDiff = Date.now() - lastTime
            lastTime = Date.now()

            if (timeDiff > 65536) {
              timeDiff = 65535
            }

            const data = Buffer.alloc(11)

            // write flags saying wheel and crank revolution data is present
            data.writeUInt8(3, 0)

            // 2-5 revs per second
            const nextWheelRevolutions = rangeMap(Math.sin(Date.now() / 10000), -1, 1, 2, 5)

            lastWheelRevolutions += nextWheelRevolutions

            if (lastWheelRevolutions > 65536) {
              lastWheelRevolutions = nextWheelRevolutions
            }

            // write wheel revolution measurement
            data.writeUInt32LE(lastWheelRevolutions, 1)

            // write wheel revolution time measurement
            data.writeUInt16LE(timeDiff, 5)

            // 1-2 revs per second, e.g. 60-120 rpm
            const nextCrankRevolutions = rangeMap(Math.sin(Date.now() / 10000), -1, 1, 1, 2)

            lastCrankRevolutions += nextCrankRevolutions

            if (lastCrankRevolutions > 65536) {
              lastCrankRevolutions = nextCrankRevolutions
            }

            // write crank revolution measurement
            data.writeUInt16LE(lastCrankRevolutions, 7)

            // write crank revolution time measurement
            data.writeUInt16LE(timeDiff, 9)

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