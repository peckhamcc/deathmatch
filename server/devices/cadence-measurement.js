const readBytes = require('./read-bytes')
const debug = require('debug')('deathmatch:cadence-measurement')

const cadenceMeasurement = (buffer) => {
  const flags = buffer.readInt8(0)

  let offset = 1

  const output = {
    flags: flags
  }

  debug('-- s/c buffer start --')
  for(var i = 0; i < buffer.length; i++) {
    var string = buffer[i].toString(2)

    debug('00000000'.substring(0, 8 - string.length) + string)
  }
  debug('-- s/c buffer end --')

  const wheelRevolutionDataPresent = flags & 0b01
  const crankRevolutionDataPresent = flags & 0b10

  if (wheelRevolutionDataPresent) {
    output.cumulativeWheelRevolutions = readBytes(buffer, offset, 4)
    offset += 4
    output.lastWheelEventTime = readBytes(buffer, offset, 2)
    offset +=2
  }

  if (crankRevolutionDataPresent) {
    output.cumulativeCrankRevolutions = readBytes(buffer, offset, 2)
    offset += 2
    output.lastCrankEventTime = readBytes(buffer, offset, 2)
    offset +=2
  }

  return output
}

module.exports = cadenceMeasurement
