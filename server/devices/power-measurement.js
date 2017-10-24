
const powerMeasurement = (buffer) => {
  /*const flags = buffer.readInt16BE(0)
  const power = buffer.readInt16BE(1)

  console.info('flags', flags.toString(2))
  console.info('power', power)

  return {
    flags: flags,
    instantaneousPower: power,
    pedalPowerBalance: 0,
    pedalPowerBalanceReference: 0,
    accumulatedTorque: 0,
    accumulatedTorqueSource: 'wheel',
    wheelRevolutions: 0,
    crankRevolutions: 0,
    extremeForceMagnitudes: 0,
    extremeTorqueMagnitudes: 0,
    extremeAngles: 0,
    topDeadSpotAngle: 0,
    bottomDeadSpotAngle: 0,
    accumulatedEnergy: 0,
    offsetCompensation: 0
  }
*/
  const flags = buffer.readInt16BE(0)
  const power = buffer.readInt16BE(1)

  let offset = 2

  const output = {
    flags: flags,
    instantaneousPower: power,
    pedalPowerBalanceReference: 'unknown'
  }

  if (flags && parseInt('1', 2)) {
    output.pedalPowerBalance = buffer.readInt8(offset)
    offset += 1
  }

  if (flags && parseInt('10', 2)) {
    output.pedalPowerBalanceReference = 'left'
  }

  if (flags && parseInt('100', 2)) {
    output.accumulatedTorque = buffer.readInt16BE(offset)
    offset += 1
  }

  if (flags && parseInt('1000', 2)) {
    output.accumulatedTorqueSource = 'crank'
  }
  return output
}

module.exports = powerMeasurement
