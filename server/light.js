const debug = require('debug')('light')
const Board = require('firmata')
const board = new Board('/dev/cu.usbmodem1431', {
  skipCapabilities: true
})

let ready = false

board.on('ready', () => {
  debug('Light connected')
  ready = true
  module.exports.colour(0, 0, 0)
  module.exports.motor(0)
})

board.on('error', error => {
  console.error('Board error', error)
})

const LIGHT_MODE = 200
const FLASH_MODE = 255

const MODE_PIN = 1
const RED_PIN = 2
const GREEN_PIN = 3
const BLUE_PIN = 4
const MOTOR_PIN = 5
const FLASH_PIN = 6

const queue = []
let timeout
let draining

const poll = (fn, frequency = 10) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (fn()) {
        clearInterval(interval)
        resolve()
      }
    }, frequency)
  })
}

const write = (pin, value) => {
  queue.push({
    pin, value
  })

  if (draining) {
    return
  }

  if (timeout) {
    clearTimeout(timeout)
  }

  timeout = setTimeout(drain, 1)
}

const drain = async () => {
  draining = true

  while(queue.length) {
    const operation = queue.shift()

    if (!ready) {
      queue.length = 0

      break;
    }

    board.analogWrite(operation.pin, operation.value)

    await poll(() => {
      return board.pending === 0
    })
  }

  draining = false
}

module.exports = {
  flash: (speed) => {
    write(MODE_PIN, FLASH_MODE)

    write(FLASH_PIN, speed)

    debug(`Setting flash speed to ${speed}`)
  },

  colour: (red, green, blue) => {
    write(MODE_PIN, LIGHT_MODE)

    write(RED_PIN, red)
    write(GREEN_PIN, green)
    write(BLUE_PIN, blue)

    debug(`Setting colour to r${red} g${green} b${blue}`)
  },

  motor: (speed) => {
    write(MODE_PIN, LIGHT_MODE)

    write(MOTOR_PIN, speed)

    debug(`Setting motor speed to ${speed}`)
  }
}

