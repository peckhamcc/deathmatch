const readBytes = require('./read-bytes')
const debug = require('debug')('deathmatch:power-measurement')

const powerMeasurement = (buffer) => {
  const flags = buffer.readInt16BE(0)
  const power = readBytes(buffer, 2, 2)

  debug('-- power buffer start --')
  for(var i = 0; i < buffer.length; i++) {
    var string = buffer[i].toString(2)

    debug('00000000'.substring(0, 8 - string.length) + string)
  }
  debug('-- power buffer end --')

  const output = {
    flags: flags,
    instantaneousPower: power
  }

  return output
}

module.exports = powerMeasurement
