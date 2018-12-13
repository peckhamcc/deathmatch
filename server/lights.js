const debug = require('debug')('deathmatch:light')
const SerialPort = require('serialport')
const Queue = require('p-queue')
const queue = new Queue({
  concurrency: 1
})
const port = '/dev/cu.usbmodem14501'
const serialport = new SerialPort(port, {
  baudRate: 9600
})

serialport.once('open', async () => {
  debug('Serial port is open')

  setTimeout(() => {
    // put dome light into DMX control mode
    dome(DOME.CONTROL, 150)

    // put LASER light into DMX control mode
    laser(LASER.CONTROL, 250)
  }, 5000)
})

serialport.on('error', (err) => {
  console.error(err)
})

const write = (offset, channel, value) => {
  queue.add(() => new Promise((resolve, reject) => {
    const command = `${offset + channel}c${value}w`
    debug(command)

    serialport.write(`${command}\n`, (err) => {
      if (err) {
        debug(`Wrote ${command} with error ${err}`)
        return reject(err)
      }

      debug(`Wrote ${command}`)
      resolve()
    })
  }))
}

process.on('exit', () => {
  dome.rotate(0)
  dome.strobe(0)
  dome.colour(0, 0, 0)
})

const DOME = {
  OFFSET: 0,
  CONTROL: 1,
  RED: 2,
  GREEN: 3,
  BLUE: 4,
  ROTATE: 5,
  STROBE: 6
}

const SPIDER_LIGHT = {

}

const SPIDER_LIGHT_1 = {
  ...SPIDER_LIGHT,
  OFFSET: 6
}

const SPIDER_LIGHT_2 = {
  ...SPIDER_LIGHT,
  OFFSET: 21
}

const LASER = {
  OFFSET: 36,
  CONTROL: 1,
  PATTERN: 2,
  STROBE: 3,
  POINT_SPEED: 4,
  X_AXIS: 5,
  Y_AXIS: 6,
  ZOOM: 7,
  COLOUR: 8,
  RESET: 9,
  ROTATE_X: 10,
  ROTATE_Y: 11,
  ROTATE_Z: 12
}

const dome = (channel, value) => {
  write(DOME.OFFSET, channel, value)
}

dome.colour = (r, g, b) => {
  dome(DOME.RED, r)
  dome(DOME.GREEN, g)
  dome(DOME.BLUE, b)
}

dome.rotate = (amount) => {
  dome(DOME.ROTATE, amount)
}

dome.strobe = (amount) => {
  dome(DOME.STROBE, amount)
}

const spider1 = (channel, value) => {
  write(SPIDER_LIGHT_1.OFFSET, channel, value)
}

const spider2 = (channel, value) => {
  write(SPIDER_LIGHT_2.OFFSET, channel, value)
}

const laser = (channel, value) => {
  write(LASER.OFFSET, channel, value)
}

module.exports = {
  dome,
  spider1,
  spider2,
  laser
}
