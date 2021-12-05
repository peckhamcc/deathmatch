import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Layer, Stage, Rect } from 'react-konva'
import styled from 'styled-components'
import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants/settings.js'

const StageWrapper = styled.div`
  width: ${STAGE_WIDTH}px;
  height: ${STAGE_HEIGHT}px;
  background-color: #FFF;
  margin: auto;
`

class Canvas extends Component {

  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    children: PropTypes.any.isRequired
  }

  state = {
    canvas: null
  }

  requestFullScreen = () => {
    if (!this.canvas) {
      return
    }

    this.canvas.getCanvas().webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
  }

  render () {
    return (
      <StageWrapper>
        <Stage
          width={this.props.width}
          height={this.props.height}
          ref={ref => this.canvas = ref}
          >
           <Layer>
            {this.props.children}
            <Rect
              ref={ref => ref && ref.on('click', this.requestFullScreen)}
              x={0}
              y={758}
              width={10}
              height={10}
            />
          </Layer>
        </Stage>
      </StageWrapper>
    )
  }
}

export default Canvas
