const debug = require('debug')('light')
const Board = require('firmata')
const board = new Board('/dev/cu.usbmodem1431', {
  skipCapabilities: true
})

board.on('ready', () => {
  debug('Light connected')
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

const write = (pin, value) => {
  queue.push({
    pin, value
  })

  if (timeout) {
    clearTimeout(timeout)
  }

  timeout = setTimeout(drain, 1)
}

const drain = async () => {
  draining = true

  const operation = queue.unshift()

  board.analogWrite()

  draining = false
}

module.exports = {
  flash: (speed) => {
    board.analogWrite(MODE_PIN, FLASH_MODE)

    board.analogWrite(FLASH_PIN, speed)

    debug(`Setting flash speed to ${speed}`)
  },

  colour: (red, green, blue) => {
    board.analogWrite(MODE_PIN, LIGHT_MODE)

    board.analogWrite(RED_PIN, red)
    board.analogWrite(GREEN_PIN, green)
    board.analogWrite(BLUE_PIN, blue)

    debug(`Setting colour to r${red} g${green} b${blue}`)
  },

  motor: (speed) => {
    board.analogWrite(MODE_PIN, LIGHT_MODE)

    board.analogWrite(MOTOR_PIN, speed)

    debug(`Setting motor speed to ${speed}`)
  }
}

