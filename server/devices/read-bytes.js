
const readBytes = (buffer, offset, length) => {
  let output = 0

  for (let i = 0; i < length; i++) {
    const byte = buffer.readUInt8(offset + i)

    output += (byte << (i * 8))
  }

  return output
}

export default readBytes
