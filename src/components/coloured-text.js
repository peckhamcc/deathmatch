import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Shape } from 'react-konva'
import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants/settings'
import stripes from '../../assets/stripes.png'
import assets from '../css/assets'

class ColouredText extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    font: PropTypes.string.isRequired
  }

  scene = (ctx) => {
    const textWidth = this.props.message.length * this.props.size
    const offsetLeft = parseInt((STAGE_WIDTH - textWidth) / 2, 10)
    const offsetTop = parseInt((STAGE_HEIGHT - this.props.size) / 2, 10)

    const buffer = document.createElement('canvas')
    buffer.width = textWidth
    buffer.height = this.props.size

    const bufferContext = buffer.getContext('2d')

    bufferContext.save()
    bufferContext.beginPath()

    // put text on canvas
    bufferContext.font = `${this.props.size}px ${this.props.font}`
    bufferContext.fillText(this.props.message, 0, this.props.size)
    bufferContext.fill()

    // use compositing to draw the background image
    // only where the text has been drawn
    bufferContext.beginPath()
    bufferContext.globalCompositeOperation = 'source-in'
    bufferContext.drawImage(assets.get(stripes), 0, 0, textWidth, this.props.size)

    bufferContext.restore()

    ctx.drawImage(buffer, offsetLeft, offsetTop, textWidth, this.props.size)
  }

  render () {
    return (
      <Shape
        x={0}
        y={0}
        width={STAGE_WIDTH}
        height={STAGE_HEIGHT}
        sceneFunc={this.scene}
      />
    )
  }
}

export default ColouredText
