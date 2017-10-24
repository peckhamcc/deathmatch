
const read = (flags, measurements) => {

}

const cadenceMeasurement = (buffer) => {
  const flags = buffer.readInt8(0)

  let offset = 1

  const output = {
    flags: flags
  }

  if (flags && parseInt('1', 2)) {
    output.cumulativeWheelRevolutions = buffer.readInt32BE(offset)
    offset += 4
    output.lastWheelEventTime = buffer.readInt16BE(offset)
    offset +=2
  }

  if (flags && parseInt('10', 2)) {
    output.cumulativeCrankRevolutions = buffer.readInt16BE(offset)
    offset += 2
    output.lastCrankEventTime = buffer.readInt16BE(offset)
    offset +=2
  }

  return output
}

module.exports = cadenceMeasurement
