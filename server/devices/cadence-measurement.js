import readBytes from './read-bytes.js'
import debug from 'debug'

const log = debug('deathmatch:cadence-measurement')

const cadenceMeasurement = (buffer) => {
  const flags = buffer.readInt8(0)

  let offset = 1

  const output = {
    flags: flags
  }
  /*
  log('-- s/c buffer start --')
  for(var i = 0; i < buffer.length; i++) {
    var string = buffer[i].toString(2)

    log('00000000'.substring(0, 8 - string.length) + string)
  }
  log('-- s/c buffer end --')
*/
  const wheelRevolutionDataPresent = flags & 0b01
  const crankRevolutionDataPresent = flags & 0b10

  if (wheelRevolutionDataPresent) {
    output.cumulativeWheelRevolutions = readBytes(buffer, offset, 4)
    offset += 4

    // this is when the wheels last turned (e.g. does not change while stationary)
    output.lastWheelEventTime = readBytes(buffer, offset, 2)
    offset += 2
  }

  if (crankRevolutionDataPresent) {
    output.cumulativeCrankRevolutions = readBytes(buffer, offset, 2)
    offset += 2

    // this is when the cranks last turned (e.g. does not change while coasting)
    output.lastCrankEventTime = readBytes(buffer, offset, 2)
    offset += 2
  }

  return output
}

export default cadenceMeasurement
