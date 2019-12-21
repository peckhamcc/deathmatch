const debug = require('debug')('deathmatch:dmx-controller')
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const Queue = require('p-queue')
const queue = new Queue({
  concurrency: 1
})
//const path = '/dev/cu.usbmodem14501'
// const path = '/dev/cu.usbmodem14301'
const path = '/dev/cu.usbmodem1433201'

const channels = []
let connected = false
let connectionLost = false

let port
let parser

const openSerialPort = () => {
  port = new SerialPort(path, {
    baudRate: 9600
  })

  port.on('close', () => {
    debug(`Port ${path} closed`)

    connectionLost = true
    connected = false

    queue.clear()

    setTimeout(openSerialPort, 1000)
  })

  parser = port.pipe(new Readline())
  parser.once('data', async (line) => {
    debug(`Port ${path} opened`)
    // put dome light into DMX control mode
    queue.add(() => write(1, 150))

    // put laser into DMX control mode
    queue.add(() => write(37, 250))

    connected = true

    // restore channel data
    if (connectionLost) {
      channels.forEach((value, channel) => {
        queue.add(() => write(channel, value))
      })
    }

    connectionLost = false
  })
  port.on('error', (err) => {
    if (port.isOpen) {
      port.close()
    }

    connectionLost = true
    connected = false

    queue.clear()

    setTimeout(openSerialPort, 1000)
  })
  parser.on('error', (err) => {

  })
}

const write = (channel, value) => {
  return new Promise((resolve, reject) => {
    const command = `${channel}c${value}w`
    debug(command)

    port.write(`${command}\n`, (err) => {
      if (err) {
        debug(`Wrote ${command} with error ${err}`)
        return reject(err)
      }

      debug(`Wrote ${command}`)
      resolve()
    })
  })
}

module.exports = {
  write: (offset, channel, value) => {
    channel += offset
    channels[channel] = value

    if (!connected) {
      return
    }

    queue.add(() => write(channel, value))
  }
}

openSerialPort()
