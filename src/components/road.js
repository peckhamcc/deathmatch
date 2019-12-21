import React, { Component } from 'react'
import { Image } from 'react-konva'
import backgroundRoad from '../../assets/background-road.png'
import { addAnimateable, removeAnimateable } from './animator'
import { STAGE_WIDTH } from '../constants/settings'
import assets from '../css/assets'

class Road extends Component {

  state = {
    xOffset: 0
  }

  componentDidMount () {
    addAnimateable(this.animate)
  }

  componentWillUnmount = () => {
    removeAnimateable(this.animate)
  }

  animate = () => {
    this.setState(s => {
      return {
        xOffset: s.xOffset < (0 - STAGE_WIDTH) ? 0 : s.xOffset - 10
      }
    })
  }

  render () {
    return (
      <Image
        fillPatternImage={assets.get(backgroundRoad)}
        fillPatternRepeat='repeat-x'
        x={0 + this.state.xOffset}
        y={640}
        width={2048}
        height={128}
      />
    )
  }
}

export default Road
