import debug from 'debug'
import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'
import Queue from 'p-queue'

const log = debug('deathmatch:dmx-controller')
const queue = new Queue({
  concurrency: 1
})
// const path = '/dev/cu.usbmodem14501'
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
    log(`Port ${path} closed`)

    connectionLost = true
    connected = false

    queue.clear()

    setTimeout(openSerialPort, 1000)
  })

  parser = port.pipe(new Readline())
  parser.once('data', async (line) => {
    log(`Port ${path} opened`)
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

const writeValue = (channel, value) => {
  return new Promise((resolve, reject) => {
    const command = `${channel}c${value}w`
    log(command)

    port.write(`${command}\n`, (err) => {
      if (err) {
        log(`Wrote ${command} with error ${err}`)
        return reject(err)
      }

      log(`Wrote ${command}`)
      resolve()
    })
  })
}

export function write (offset, channel, value) {
  channel += offset
  channels[channel] = value

  if (!connected) {
    return
  }

  queue.add(() => writeValue(channel, value))
}

openSerialPort()
