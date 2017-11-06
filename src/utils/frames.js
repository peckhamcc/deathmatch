
export default frames = (width, height, yOffset, frames) => {
  const output = []

  for(let i = 0; i < frames; i++) {
    output.push(width * i)
    output.push(yOffset * i)
    output.push(width)
    output.push(height)
  }

  return output
}