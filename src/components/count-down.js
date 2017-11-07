import React, { Component } from 'react'
import Proptypes from 'prop-types'
import { connect } from 'react-redux'
import { Layer, Rect, Stage, Group, Text, Image, Sprite } from 'react-konva'
import { setCountingDown } from '../store/actions'
import GAME_STATE from '../constants/game-state'
import stripes from '../../assets/stripes.png'
import assets from '../css/assets'

class CountDown extends Component {
  state = {
    count: 5
  }

  countDown = () => {
    this.setState(s => ({
      count: s.count - 1
    }))
  }

  componentDidMount () {
    this.interval = setInterval(this.countDown, 1000)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render () {
    let message = this.state.count
    let x = 400

    if (this.state.count < 1) {
      message = 'Go!'
      x = 150
    }

    return (
      <Group>
        <Text
          text={message}
          x={x}
          y={200}
          fillPatternImage={assets.get(stripes)}
          fontFamily='"Press Start 2P", monospace'
          fontSize={300}
        />
      </Group>
    )
  }
}

export default CountDown
