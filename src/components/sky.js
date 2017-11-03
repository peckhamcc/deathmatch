import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import { Image, Layer, Sprite } from 'react-konva'
import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants/settings'
import { addAnimateable, removeAnimateable } from './animator'
import backgroundExplosion from '../../assets/background-explosion.png'
import backgroundBlueTunnel from '../../assets/background-blue-tunnel.png'
import assets from '../css/assets'

class Sky extends Component {
  static propTypes = {
    players: PropTypes.array.isRequired,
    gameState: PropTypes.string.isRequired
  }

  state = {
    animating: false,
    colour: 'transparent'
  }

  componentDidMount () {
    addAnimateable(this.animate)
  }

  componentWillUnmount = () => {
    removeAnimateable(this.animate)
  }

  animate = () => {
    //let colour = 'transparent'
    let colour = '#' + Math.floor(Math.random()*16777215).toString(16)

    this.setState({
      colour
    })
  }

  setSprite = (sprite) => {
    this.sprite = sprite

    if (this.sprite && !this.sprite.isRunning()) {
      this.sprite.start()
    }
  }

  render () {
    const backgrounds = {
      colour: () => (
        <Image
          fill={this.state.colour}
          x={0}
          y={0}
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
        />
      ),
      blue: () => (
        <Sprite
          ref={this.setSprite}
          image={assets.get(backgroundBlueTunnel)}
          x={-87}
          y={-150}
          width={STAGE_WIDTH}
          height={STAGE_WIDTH}
          animation='default'
          animations={{
            default: [
              0, 0, 240, 160,
              240, 0, 240, 160,
              480, 0, 240, 160,
              720, 0, 240, 160
            ]
          }}
          frameRate={8}
          frameIndex={this.sprite && this.sprite.frameIndex() || 0}
          scale={{
            x: 5,
            y: 5
          }}
        />
      ),
      explosion: () => (
        <Sprite
          ref={this.setSprite}
          image={assets.get(backgroundExplosion)}
          x={-87}
          y={-150}
          width={STAGE_WIDTH}
          height={STAGE_WIDTH}
          animation='default'
          animations={{
            default: [
              0, 0, 240, 281,
              240, 0, 240, 281,
              480, 0, 240, 281,
              720, 0, 240, 281
            ]
          }}
          frameRate={8}
          frameIndex={this.sprite && this.sprite.frameIndex() || 0}
          scale={{
            x: 5,
            y: 5
          }}
        />
      )
    }

    //return backgrounds.explosion()
    return null
  }
}

const mapStateToProps = ({ game: { state }, players: { players } }) => ({
  gameState: state,
  players
})

const mapDispatchToProps = {

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sky)

